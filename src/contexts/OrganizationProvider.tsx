import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from './SessionProvider';

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
};

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  organizations: [],
  isLoading: true,
  switchOrganization: async () => {},
});

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setOrganization(null);
      setOrganizations([]);
      setIsLoading(false);
      return;
    }

    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);
        
        // Buscar todas as organizações do usuário
        const { data: orgMembers, error: memberError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', session.user.id);

        if (memberError) throw memberError;

        const orgIds = orgMembers?.map(m => m.organization_id) || [];
        
        if (orgIds.length === 0) {
          setOrganizations([]);
          setOrganization(null);
          return;
        }

        // Buscar detalhes das organizações
        const { data: orgs, error: orgError } = await supabase
          .from('organizations')
          .select('id, name, slug')
          .in('id', orgIds);

        if (orgError) throw orgError;

        setOrganizations(orgs || []);
        
        // Definir organização padrão (primeira encontrada)
        if (orgs && orgs.length > 0) {
          setOrganization(orgs[0]);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [session]);

  const switchOrganization = async (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setOrganization(org);
    }
  };

  return (
    <OrganizationContext.Provider value={{ 
      organization, 
      organizations, 
      isLoading, 
      switchOrganization 
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => useContext(OrganizationContext);