import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/contexts/OrganizationProvider';

export const useOrganizationSubscription = () => {
  const { organization } = useOrganization();

  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['organizationSubscription', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return null;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!organization?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const isActive = subscription?.status === 'active' || subscription?.status === 'trial';
  const isTrial = subscription?.status === 'trial';
  const trialEndDate = subscription?.end_date ? new Date(subscription.end_date) : null;

  return {
    subscription,
    isActive,
    isTrial,
    trialEndDate,
    isLoading,
    error
  };
};