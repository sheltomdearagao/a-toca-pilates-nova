import { useOrganization } from '@/contexts/OrganizationProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { useCallback } from 'react';

export const useOrganizationData = () => {
  const { organization, isLoading } = useOrganization();

  const withOrganization = useCallback(<T extends Record<string, any>>(data: T): T & { organization_id: string } => {
    if (!organization) {
      const error = 'Nenhuma organização selecionada. Por favor, selecione uma organização.';
      showError(error);
      throw new Error(error);
    }
    
    return {
      ...data,
      organization_id: organization.id
    };
  }, [organization]);

  const getOrganizationId = useCallback((): string => {
    if (!organization) {
      const error = 'Nenhuma organização selecionada. Por favor, selecione uma organização.';
      showError(error);
      throw new Error(error);
    }
    return organization.id;
  }, [organization]);

  const validateOrganizationAccess = useCallback(async (): Promise<boolean> => {
    if (!organization) {
      return false;
    }

    try {
      // Verify the user still has access to this organization
      const { data, error } = await supabase
        .from('organization_members')
        .select('id')
        .eq('organization_id', organization.id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (error || !data) {
        showError('Acesso à organização negado');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating organization access:', error);
      return false;
    }
  }, [organization]);

  return {
    organization,
    isLoading,
    withOrganization,
    getOrganizationId,
    validateOrganizationAccess
  };
};