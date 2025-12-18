import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Zap, 
  CheckCircle, 
  BarChart3, 
  MessageSquare,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Gestão de Alunos",
      description: "Cadastre, acompanhe e gerencie todos os seus alunos em um só lugar."
    },
    {
      icon: Calendar,
      title: "Agenda Inteligente",
      description: "Organize aulas, controle frequência e evite conflitos de horários."
    },
    {
      icon: DollarSign,
      title: "Controle Financeiro",
      description: "Controle mensalidades, pagamentos e gere relatórios financeiros."
    },
    {
      icon: BarChart3,
      title: "Relatórios Avançados",
      description: "Acompanhe o desempenho da sua academia com métricas detalhadas."
    },
    {
      icon: MessageSquare,
      title: "Comunicação",
      description: "Envie mensagens e lembretes diretamente para seus alunos."
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Dados protegidos e backup automático para sua tranquilidade."
    }
  ];

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Proprietária da Pilates Studio",
      content: "O SIGA VIDA revolucionou a forma como gerencio minha academia. Tudo em um só lugar!",
      avatar: "AS"
    },
    {
      name: "Carlos Mendes",
      role: "Diretor da Academia Fitness",
      content: "Reduzimos em 80% o tempo gasto com administração. O retorno sobre o investimento é impressionante.",
      avatar: "CM"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            SIGA VIDA
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground max-w-3xl mx-auto mb-8">
            Sistema Integrado de Gestão e Atendimento Vida
          </p>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-10">
            Tudo o que você precisa para gerenciar sua academia de forma inteligente e eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-white text-primary hover:bg-primary-foreground"
              onClick={() => navigate('/signup')}
            >
              Comece Agora - 14 dias grátis
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-white text-white hover:bg-white/10"
              onClick={() => navigate('/pricing')}
            >
              Ver Planos
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo que você precisa em um só lugar</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades completas para gerenciar sua academia com eficiência
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comece a gerenciar sua academia em minutos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Cadastre sua Academia</h3>
              <p className="text-muted-foreground">
                Crie sua conta e registre as informações da sua academia em minutos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Configure seu Plano</h3>
              <p className="text-muted-foreground">
                Escolha o plano ideal para o tamanho da sua academia e comece a usar.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Comece a Gerenciar</h3>
              <p className="text-muted-foreground">
                Adicione alunos, organize aulas e controle finanças com facilidade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Academias que já transformaram sua gestão com o SIGA VIDA
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para transformar sua academia?
          </h2>
          <p className="text-xl text-primary-foreground max-w-2xl mx-auto mb-10">
            Junte-se a centenas de academias que já estão usando o SIGA VIDA
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-primary-foreground"
            onClick={() => navigate('/signup')}
          >
            Comece Agora - 14 dias grátis
          </Button>
          <p className="text-primary-foreground/80 mt-4">
            Sem cartão de crédito necessário para o teste gratuito
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;