import { useState } from 'react';
import { useOrganization } from '@/contexts/OrganizationProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Users, Mail, Phone } from 'lucide-react';

const OrganizationSettings = () => {
  const { organization, isLoading } = useOrganization();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    description: '',
    email: '',
    phone: '',
    address: ''
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Nenhuma organização selecionada</h2>
        <p className="text-muted-foreground mt-2">
          Selecione uma organização para gerenciar suas configurações.
        </p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: formData.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', organization.id);

      if (error) throw error;

      showSuccess('Configurações salvas com sucesso!');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configurações da Organização - SIGA VIDA</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações da sua organização {organization.name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
            <CardDescription>
              Informações principais da sua organização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nome da Organização</Label>
              <Input
                id="orgName"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome da sua organização"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orgDescription">Descrição</Label>
              <Textarea
                id="orgDescription"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva sua organização"
                rows={3}
              />
            </div>
            
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contato
            </CardTitle>
            <CardDescription>
              Informações de contato da organização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgEmail">Email</Label>
              <Input
                id="orgEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="contato@suaorganizacao.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orgPhone">Telefone</Label>
              <Input
                id="orgPhone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orgAddress">Endereço</Label>
              <Textarea
                id="orgAddress"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Endereço completo"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membros da Equipe
          </CardTitle>
          <CardDescription>
            Gerencie os membros da sua equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium mt-4">Convide sua equipe</h3>
            <p className="text-muted-foreground mt-2">
              Adicione professores, recepcionistas e outros membros da sua equipe.
            </p>
            <Button className="mt-4">Convidar Membros</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSettings;