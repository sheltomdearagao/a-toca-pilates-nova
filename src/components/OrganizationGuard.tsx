import { useEffect } from 'react';
import { useOrganization } from '@/contexts/OrganizationProvider';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { Building } from 'lucide-react';

interface OrganizationGuardProps {
  children: React.ReactNode;
}

const OrganizationGuard = ({ children }: OrganizationGuardProps) => {
  const { organization, organizations, isLoading } = useOrganization();
  const navigate = useNavigate();

  useEffect(() => {
    // If user has no organizations, redirect to create one
    if (!isLoading && organizations.length === 0) {
      navigate('/signup');
    }
  }, [isLoading, organizations, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Carregando organização..." />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-screen">
        <EmptyState
          icon={<Building className="w-16 h-16" />}
          title="Nenhuma organização selecionada"
          description="Por favor, selecione uma organização para continuar ou crie uma nova."
          action={{
            label: "Criar Organização",
            onClick: () => navigate('/signup')
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default OrganizationGuard;