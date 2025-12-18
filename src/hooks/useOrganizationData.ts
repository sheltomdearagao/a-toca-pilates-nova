import { useOrganization } from '@/contexts/OrganizationProvider';
import { showError } from '@/utils/toast';

export const useOrganizationData = () => {
  const { organization, isLoading } = useOrganization();

  const withOrganization = <T extends Record<string, any>>(data: T): T & { organization_id: string } => {
    if (!organization) {
      throw new Error('Nenhuma organização selecionada');
    }
    
    return {
      ...data,
      organization_id: organization.id
    };
  };

  const getOrganizationId = (): string => {
    if (!organization) {
      throw new Error('Nenhuma organização selecionada');
    }
    return organization.id;
  };

  return {
    organization,
    isLoading,
    withOrganization,
    getOrganizationId
  };
};