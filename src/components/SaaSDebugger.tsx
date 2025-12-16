import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

const SaaSDebugger = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [studentsCount, setStudentsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus('loading');
        
        // 1. Get the logged-in user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('User not authenticated');
        setUserId(user.id);
        
        // 2. Get the organization from organization_members
        const { data: orgMember, error: orgError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id)
          .single();
        
        if (orgError && orgError.code !== 'PGRST116') {
          throw new Error(`Error fetching organization: ${orgError.message}`);
        }
        
        const organizationId = orgMember?.organization_id || null;
        setOrgId(organizationId);
        
        // 3. Try to count students (to test RLS)
        if (organizationId) {
          const { count, error: countError } = await supabase
            .from('students')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', organizationId);
          
          if (countError) throw new Error(`Error counting students: ${countError.message}`);
          setStudentsCount(count || 0);
        }
        
        setStatus('success');
      } catch (error: any) {
        setStatus('error');
        console.error('Error in SaaSDebugger:', error);
      }
    };

    fetchData();
  }, []);

  const handleTestWrite = async () => {
    try {
      // Get the user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Get the organization
      const { data: orgMember } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();
      
      if (!orgMember?.organization_id) {
        throw new Error('Organization not found');
      }
      
      // Try to insert a dummy student
      const { error: insertError } = await supabase
        .from('students')
        .insert({
          name: `Teste SaaS ${Date.now()}`,
          organization_id: orgMember.organization_id,
          user_id: user.id,
          status: 'Ativo',
          enrollment_type: 'Particular',
          plan_type: 'Avulso'
        });
      
      if (insertError) throw insertError;
      
      showSuccess('Escrita OK - Trigger funcionou');
    } catch (error: any) {
      showError(`Erro na escrita: ${error.message}`);
    }
  };

  return (
    <Card className="fixed top-4 right-4 z-50 shadow-lg border border-muted bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">SaaS Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">User ID:</span>
            <span className="text-sm text-muted-foreground">{userId || 'Loading...'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Org ID:</span>
            {orgId ? (
              <span className="text-sm text-muted-foreground">{orgId}</span>
            ) : (
              <Alert variant="destructive" className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>Órfão de Organização</AlertDescription>
              </Alert>
            )}
          </div>
          {orgId && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Students Count:</span>
              <span className="text-sm text-muted-foreground">{studentsCount || 'Loading...'}</span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleTestWrite} 
          variant="outline" 
          className="w-full"
          disabled={status !== 'success' || !orgId}
        >
          {status === 'loading' ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          ) : (
            'Teste de Escrita'
          )}
        </Button>
        
        {status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Ocorreu um erro ao carregar os dados. Verifique o console para detalhes.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SaaSDebugger;