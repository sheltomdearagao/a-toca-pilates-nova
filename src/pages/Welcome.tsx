import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganization } from '@/contexts/OrganizationProvider';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, DollarSign, Building, LayoutDashboard } from 'lucide-react'; // Import LayoutDashboard

const Welcome = () => {
  const { organization } = useOrganization();
  const navigate = useNavigate();

  const features = [
    {
      title: "Gerenciar Alunos",
      description: "Cadastre e acompanhe todos os seus alunos em um só lugar.",
      icon: Users,
      path: "/app/alunos"
    },
    {
      title: "Agenda de Aulas",
      description: "Organize a agenda de aulas e acompanhe a frequência.",
      icon: Calendar,
      path: "/app/agenda"
    },
    {
      title: "Financeiro",
      description: "Controle financeiro completo com lançamentos e relatórios.",
      icon: DollarSign,
      path: "/app/financeiro"
    },
    {
      title: "Configurações",
      description: "Personalize sua organização e convide membros da equipe.",
      icon: Building,
      path: "/app/configuracoes"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo à {organization?.name} - SIGA VIDA!</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sua plataforma está pronta para gerenciar sua academia de pilates.
        </p>
        <Button 
          className="mt-6 text-lg px-8 py-6"
          onClick={() => navigate('/app/dashboard')}
        >
          <LayoutDashboard className="w-5 h-5 mr-2" />
          Ir para a Dashboard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.title} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
                <Button variant="link" className="p-0 h-auto mt-4">
                  Acessar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>
            Recomendamos que você comece configurando sua organização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium">Convide sua equipe</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione professores e recepcionistas à sua organização.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium">Cadastre seus alunos</h3>
                <p className="text-sm text-muted-foreground">
                  Importe ou adicione manualmente seus alunos atuais.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium">Configure planos e preços</h3>
                <p className="text-sm text-muted-foreground">
                  Defina os planos de aula e preços da sua academia.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;