import { useState } from 'react';
import { useOrganization } from '@/contexts/OrganizationProvider';
import { useOrganizationSubscription } from '@/hooks/useOrganizationSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const SubscriptionManagement = () => {
  const { organization } = useOrganization();
  const { subscription, isActive, isTrial, trialEndDate, isLoading } = useOrganizationSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      // Here you would integrate with a payment gateway
      // For now, we simulate the subscription update
      if (subscription && organization) {
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            plan_type: 'professional', // Assuming upgrade to professional plan
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
          })
          .eq('id', subscription.id);

        if (error) throw error;
        
        showSuccess('Assinatura atualizada com sucesso!');
      }
    } catch (error: any) {
      showError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      if (subscription && organization) {
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('id', subscription.id);

        if (error) throw error;
        
        showSuccess('Assinatura cancelada com sucesso!');
      }
    } catch (error: any) {
      showError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Assinatura - SIGA VIDA</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie o plano e pagamento da sua organização {organization?.name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Status da Assinatura
            </CardTitle>
            <CardDescription>
              Informações sobre sua assinatura atual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription ? (
              <>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-semibold">Plano {subscription.plan_type || 'N/A'}</h3> {/* Dynamic plan_type */}
                    <p className="text-sm text-muted-foreground">
                      {isActive ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subscription.status}
                  </div>
                </div>

                {isTrial && trialEndDate && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Período de Teste</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Seu teste gratuito termina em {format(trialEndDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Início</span>
                    <span>
                      {subscription.start_date 
                        ? format(new Date(subscription.start_date), "dd/MM/yyyy") 
                        : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Término</span>
                    <span>
                      {subscription.end_date 
                        ? format(new Date(subscription.end_date), "dd/MM/yyyy") 
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">Nenhuma assinatura encontrada</h3>
                <p className="text-muted-foreground mt-2">
                  Sua organização ainda não possui uma assinatura ativa.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Ações
            </CardTitle>
            <CardDescription>
              Gerencie sua assinatura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isActive ? (
              <Button 
                className="w-full" 
                onClick={handleUpgrade}
                disabled={isProcessing}
              >
                {isProcessing && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>}
                Ativar Assinatura
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleCancel}
                disabled={isProcessing}
              >
                {isProcessing && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>}
                Cancelar Assinatura
              </Button>
            )}

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Precisa de ajuda?</h4>
              <p className="text-sm text-muted-foreground">
                Entre em contato com nosso suporte para dúvidas sobre sua assinatura.
              </p>
              <Button variant="outline" className="mt-2 w-full">
                Contatar Suporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionManagement;