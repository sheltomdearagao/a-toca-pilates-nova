import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CreditCard, Building, User, Lock } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

const Checkout = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cpfCnpj: '',
    companyName: '',
    plan: 'professional',
    paymentMethod: 'credit',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    acceptTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em uma implementação real, aqui você integraria com um gateway de pagamento
      // como Stripe, PayPal, ou um PSP brasileiro como Pagar.me, Iugu, etc.
      
      showSuccess('Pagamento processado com sucesso! Bem-vindo ao SIGA VIDA.');
      navigate('/dashboard');
    } catch (error) {
      showError('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Checkout SIGA VIDA</h1>
          <p className="text-muted-foreground mt-2">
            Complete seu cadastro e escolha seu método de pagamento
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário de Checkout */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Informações de Pagamento
                </CardTitle>
                <CardDescription>
                  Preencha seus dados para concluir a assinatura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Informações da Empresa */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Informações da Empresa
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Nome da sua academia"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome Completo</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                        <Input
                          id="cpfCnpj"
                          name="cpfCnpj"
                          value={formData.cpfCnpj}
                          onChange={handleInputChange}
                          placeholder="Seu CPF ou CNPJ"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Método de Pagamento */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Método de Pagamento</h3>
                    
                    <RadioGroup 
                      value={formData.paymentMethod} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Cartão de Crédito
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="debit" id="debit" />
                        <Label htmlFor="debit">Cartão de Débito</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="boleto" id="boleto" />
                        <Label htmlFor="boleto">Boleto Bancário</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Informações do Cartão */}
                  {formData.paymentMethod !== 'boleto' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Informações do Cartão
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="0000 0000 0000 0000"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nome no Cartão</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="Nome como impresso no cartão"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Validade</Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input
                            id="cardCvv"
                            name="cardCvv"
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Termos e Condições */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, acceptTerms: !!checked }))
                      }
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      Concordo com os <a href="#" className="text-primary hover:underline">Termos de Serviço</a> e 
                      <a href="#" className="text-primary hover:underline"> Política de Privacidade</a>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isProcessing || !formData.acceptTerms}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      `Pagar R$ ${formData.plan === 'basic' ? '99' : formData.plan === 'professional' ? '199' : '399'}/mês`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Plano Profissional</h3>
                      <p className="text-sm text-muted-foreground">Até 200 alunos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ 199,00</p>
                      <p className="text-sm text-muted-foreground">por mês</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R$ 199,00</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>Desconto</span>
                      <span className="text-green-600">R$ 0,00</span>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t font-semibold">
                      <span>Total</span>
                      <span>R$ 199,00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">O que está incluso:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Até 200 alunos</li>
                    <li>• Agenda de aulas ilimitada</li>
                    <li>• Gestão financeira completa</li>
                    <li>• Relatórios avançados</li>
                    <li>• Múltiplos professores</li>
                    <li>• Suporte prioritário</li>
                    <li>• Integrações com WhatsApp</li>
                  </ul>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Ao assinar, você concorda com a renovação automática mensal.</p>
                  <p className="mt-1">Cancele a qualquer momento.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;