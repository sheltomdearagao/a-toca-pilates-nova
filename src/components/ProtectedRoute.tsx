import { useSession } from '@/contexts/SessionProvider';
import { useOrganizationSubscription } from '@/hooks/useOrganizationSubscription';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const { isActive, isLoading: isSubscriptionLoading } = useOrganizationSubscription();

  if (isSessionLoading || isSubscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!isActive) {
    // Se a assinatura não estiver ativa, redirecionar para página de pagamento
    return <Navigate to="/pricing" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;