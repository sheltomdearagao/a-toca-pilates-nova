import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2, CheckCircle } from 'lucide-react';

const OrganizationSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Dados da empresa, 2: Plano, 3: Conta de administrador
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [formData, setFormData] = useState({
    companyName: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.companyName.trim()) {
        showError('Por favor, informe o nome da sua empresa');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Criar usuário admin da organização
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.adminEmail,
        password: formData.adminPassword,
        options: {
          data: {
            full_name: formData.adminName,
            role: 'org_admin',
            company: formData.companyName
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Falha ao criar usuário');
      }

      // 2. Criar organização
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.companyName,
          slug: formData.companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // 3. Criar associação do admin com a organização
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: orgData.id,
          user_id: authData.user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      // 4. Criar assinatura (simulada)
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          organization_id: orgData.id,
          plan_type: selectedPlan,
          status: 'trial', // Iniciar com período de teste
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 dias de teste
        });

      if (subscriptionError) throw subscriptionError;

      showSuccess('Organização criada com sucesso! Verifique seu email para confirmar a conta.');
      navigate('/login');
    } catch (error: any) {
      showError(error.message || 'Erro ao criar organização');
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'R$ 99',
      description: 'Perfeito para pequenas academias',
      features: ['Até 50 alunos', 'Agenda ilimitada', 'Gestão financeira básica']
    },
    {
      id: 'professional',
      name: 'Profissional',
      price: 'R$ 199',
      description: 'Para academias em crescimento',
      features: ['Até 200 alunos', 'Agenda ilimitada', 'Gestão financeira completa', 'Relatórios avançados']
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: 'R$ 399',
      description: 'Para grandes redes de academias',
      features: ['Alunos ilimitados', 'Múltiplas unidades', 'Todas as funcionalidades']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {step === 1 && 'Informações da Empresa'}
                {step === 2 && 'Escolha seu Plano'}
                {step === 3 && 'Conta de Administrador'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Informe os dados da sua academia'}
                {step === 2 && 'Selecione o plano ideal para sua necessidade'}
                {step === 3 && 'Crie sua conta de administrador'}
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step === s 
                      ? 'bg-primary text-primary-foreground' 
                      : step > s 
                        ? 'bg-green-500 text-white' 
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignup}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Academia</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Nome da sua academia"
                    required
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" disabled>
                    Voltar
                  </Button>
                  <Button type="button" onClick={handleNext}>
                    Próximo
                  </Button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <Card 
                      key={plan.id}
                      className={`cursor-pointer transition-all ${
                        selectedPlan === plan.id 
                          ? 'ring-2 ring-primary shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold">{plan.price}<span className="text-sm font-normal">/mês</span></div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button type="button" onClick={handleNext}>
                    Próximo
                  </Button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Nome Completo</Label>
                    <Input
                      id="adminName"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleInputChange}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email</Label>
                    <Input
                      id="adminEmail"
                      name="adminEmail"
                      type="email"
                      value={formData.adminEmail}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Senha</Label>
                    <Input
                      id="adminPassword"
                      name="adminPassword"
                      type="password"
                      value={formData.adminPassword}
                      onChange={handleInputChange}
                      placeholder="Senha segura"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirme sua senha"
                      required
                    />
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Plano Selecionado: {plans.find(p => p.id === selectedPlan)?.name}</h3>
                  <p className="text-sm">
                    Você terá 14 dias grátis para testar todas as funcionalidades. 
                    Após o período de teste, será cobrado {plans.find(p => p.id === selectedPlan)?.price}/mês.
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Conta
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSignup;