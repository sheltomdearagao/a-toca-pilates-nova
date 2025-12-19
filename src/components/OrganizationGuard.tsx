import { useEffect } from 'react';
import { useOrganization } from '@/contexts/OrganizationProvider';
import { useNavigate, Navigate } from 'react-router-dom'; // Adicionado Navigate
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { Building, MailCheck } from 'lucide-react';
import { useSession } from '@/contexts/SessionProvider';

interface OrganizationGuardProps {
  children: React.ReactNode;
}

const OrganizationGuard = ({ children }: OrganizationGuardProps) => {
  const { organization, organizations, isLoading } = useOrganization();
  const { session, isLoading: isSessionLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isSessionLoading && session?.user && organizations.length === 0) {
      if (!session.user.email_confirmed_at) {
        console.log("User logged in, email not confirmed, no organizations found.");
      } else {
        console.warn("User logged in, email confirmed, but no organizations found. Redirecting to signup.");
        navigate('/signup');
      }
    }
  }, [isLoading, isSessionLoading, organizations, session, navigate]);

  if (isLoading || isSessionLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Carregando organização..." />
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  if (!organization) {
    if (!session.user.email_confirmed_at) {
      return (
        <div className="flex items-center justify-center h-screen">
          <EmptyState
            icon={<MailCheck className="w-16 h-16 text-yellow-500" />}
            title="Confirme seu email"
            description="Uma organização foi criada, mas você precisa confirmar seu endereço de email para acessá-la. Verifique sua caixa de entrada."
            action={{
              label: "Ir para Login",
              onClick: () => navigate('/login')
            }}
          />
        </div>
      );
    } else if (organizations.length === 0) {
      return (
        <div className="flex items-center justify-center h-screen">
          <EmptyState
            icon={<Building className="w-16 h-16" />}
            title="Nenhuma organização encontrada"
            description="Parece que você não pertence a nenhuma organização. Por favor, crie uma nova para começar."
            action={{
              label: "Criar Organização",
              onClick: () => navigate('/signup')
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-screen">
          <EmptyState
            icon={<Building className="w-16 h-16" />}
            title="Erro ao carregar organização"
            description="Ocorreu um problema ao carregar sua organização. Por favor, tente recarregar a página."
            action={{
              label: "Recarregar Página",
              onClick: () => window.location.reload()
            }}
          />
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default OrganizationGuard;