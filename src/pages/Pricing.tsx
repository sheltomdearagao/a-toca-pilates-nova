import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Users, Calendar, DollarSign, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'R$ 99',
      period: 'mês',
      description: 'Perfeito para pequenas academias iniciantes',
      features: [
        'Até 50 alunos',
        'Agenda de aulas ilimitada',
        'Gestão financeira básica',
        'Relatórios mensais',
        'Suporte por email'
      ],
      notIncluded: [
        'Múltiplos professores',
        'Relatórios avançados',
        'Integrações externas'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Profissional',
      price: 'R$ 199',
      period: 'mês',
      description: 'Para academias em crescimento',
      features: [
        'Até 200 alunos',
        'Agenda de aulas ilimitada',
        'Gestão financeira completa',
        'Relatórios avançados',
        'Múltiplos professores',
        'Suporte prioritário',
        'Integrações com WhatsApp'
      ],
      notIncluded: [
        'Relatórios personalizados',
        'Integrações avançadas'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: 'R$ 399',
      period: 'mês',
      description: 'Para grandes redes de academias',
      features: [
        'Alunos ilimitados',
        'Múltiplas unidades',
        'Agenda de aulas ilimitada',
        'Gestão financeira completa',
        'Relatórios personalizados',
        'Múltiplos professores ilimitados',
        'Suporte 24/7',
        'Todas as integrações',
        'Treinamento personalizado'
      ],
      notIncluded: [],
      popular: false
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Aqui você pode redirecionar para a página de checkout ou pagamento
    // Por enquanto, vamos simular o pagamento e redirecionar para o dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Planos SIGADesk</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano perfeito para a sua academia. Cresça com inteligência.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden ${plan.popular ? 'ring-2 ring-primary shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-bold">
                  MAIS POPULAR
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {plan.id === 'basic' && <Users className="h-12 w-12 text-primary" />}
                  {plan.id === 'professional' && <Zap className="h-12 w-12 text-primary" />}
                  {plan.id === 'enterprise' && <DollarSign className="h-12 w-12 text-primary" />}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  
                  {plan.notIncluded.map((feature, index) => (
                    <li key={`not-${index}`} className="flex items-start text-muted-foreground">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {selectedPlan === plan.id ? 'Processando...' : 'Escolher Plano'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
          <div className="max-w-3xl mx-auto text-left space-y-4">
            <div>
              <h3 className="font-semibold">Como funciona o pagamento?</h3>
              <p className="text-muted-foreground">
                O pagamento é feito mensalmente através de cartão de crédito, débito ou boleto bancário. 
                Você pode cancelar a qualquer momento.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Posso mudar de plano?</h3>
              <p className="text-muted-foreground">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                As alterações são refletidas no próximo ciclo de cobrança.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Há período de teste?</h3>
              <p className="text-muted-foreground">
                Sim, oferecemos 14 dias de teste gratuito para todos os planos. 
                Não é necessário cartão de crédito para começar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;