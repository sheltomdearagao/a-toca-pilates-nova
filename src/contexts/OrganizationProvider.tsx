import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from './SessionProvider';
import { showError, showSuccess } from '@/utils/toast';

type Organization = {
  id: string;
  name: string;
  slug: string;
};

type OrganizationContextType = {
  organization: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  switchOrganization: (orgId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
};

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  organizations: [],
  isLoading: true,
  switchOrganization: async () => {},
  refreshOrganizations: async () => {},
});

const ORGANIZATION_STORAGE_KEY = 'siga_vida_active_organization';

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set organization context in Supabase session
  const setOrganizationContext = useCallback(async (orgId: string) => {
    try {
      // Call the RPC function to set organization context
      const { error } = await supabase.rpc('set_organization_context', {
        p_organization_id: orgId
      });

      if (error) {
        console.error('Error setting organization context:', error);
        throw error;
      }

      // Log the organization switch for audit purposes
      await supabase.from('organization_access_log').insert({
        user_id: session?.user?.id,
        organization_id: orgId,
        action: 'organization_switched',
        ip_address: null, // Could be populated from request headers
        user_agent: navigator.userAgent
      });

      console.log('✅ Organization context set successfully:', orgId);
    } catch (error) {
      console.error('❌ Failed to set organization context:', error);
      throw error;
    }
  }, [session]);

  // Fetch organizations for the current user
  const fetchOrganizations = useCallback(async () => {
    if (!session?.user) {
      setOrganization(null);
      setOrganizations([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch all organizations the user belongs to
      const { data: orgMembers, error: memberError } = await supabase
        .from('organization_members')
        .select('organizations(id, name, slug)')
        .eq('user_id', session.user.id);

      if (memberError) throw memberError;

      // Extract organization objects from the nested structure
      const orgs: Organization[] = (orgMembers || []).map(m => {
        const org = Array.isArray(m.organizations) ? m.organizations[0] : m.organizations;
        return {
          id: org.id,
          name: org.name,
          slug: org.slug
        };
      });
      
      setOrganizations(orgs);
      
      // Try to restore previously selected organization from localStorage
      const savedOrgId = localStorage.getItem(ORGANIZATION_STORAGE_KEY);
      let selectedOrg: Organization | null = null;

      if (savedOrgId && orgs.some(o => o.id === savedOrgId)) {
        selectedOrg = orgs.find(o => o.id === savedOrgId) || null;
      } else if (orgs.length > 0) {
        // Default to first organization if no saved preference
        selectedOrg = orgs[0];
      }

      if (selectedOrg) {
        await setOrganizationContext(selectedOrg.id);
        setOrganization(selectedOrg);
        localStorage.setItem(ORGANIZATION_STORAGE_KEY, selectedOrg.id);
      } else {
        // No organizations found - user is orphaned
        console.warn('⚠️ User has no organizations');
        setOrganization(null);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      showError('Erro ao carregar organizações. Por favor, recarregue a página.');
    } finally {
      setIsLoading(false);
    }
  }, [session, setOrganizationContext]);

  // Switch to a different organization
  const switchOrganization = useCallback(async (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    
    if (!org) {
      showError('Organização não encontrada');
      return;
    }

    try {
      setIsLoading(true);
      
      // Set the new organization context in the database session
      await setOrganizationContext(orgId);
      
      // Update local state
      setOrganization(org);
      localStorage.setItem(ORGANIZATION_STORAGE_KEY, orgId);
      
      showSuccess(`Organização alterada para: ${org.name}`);
      
      // Force a page reload to ensure all queries use the new context
      window.location.reload();
    } catch (error: any) {
      console.error('Error switching organization:', error);
      showError('Erro ao trocar de organização: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [organizations, setOrganizationContext]);

  // Refresh organizations list
  const refreshOrganizations = useCallback(async () => {
    await fetchOrganizations();
  }, [fetchOrganizations]);

  // Initial load
  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  // Re-set organization context on page reload/refresh
  useEffect(() => {
    if (organization?.id && session?.user) {
      setOrganizationContext(organization.id).catch(error => {
        console.error('Failed to restore organization context:', error);
      });
    }
  }, [organization?.id, session?.user, setOrganizationContext]);

  return (
    <OrganizationContext.Provider value={{ 
      organization, 
      organizations, 
      isLoading, 
      switchOrganization,
      refreshOrganizations
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => useContext(OrganizationContext);