
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LogIn, UserPlus, Shield } from 'lucide-react';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    fullName: '', 
    phone: '' 
  });
  
  const { signIn, signUp, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isCorretorLogin = location.pathname === '/corretor/login';

  const waitForProfileAndRedirect = () => {
    const checkProfile = () => {
      console.log('Checking profile for redirect...', profile);
      
      if (profile) {
        console.log('Profile found, redirecting based on user type:', profile.user_type);
        
        if (profile.user_type === 'admin') {
          navigate('/admin/dashboard');
        } else if (profile.user_type === 'broker' || isCorretorLogin) {
          navigate('/corretor/dashboard');
        } else {
          navigate('/cliente/dashboard');
        }
      } else if (user) {
        // Profile not loaded yet, wait a bit more
        console.log('User exists but profile not loaded, waiting...');
        setTimeout(checkProfile, 500);
      }
    };
    
    checkProfile();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando..."
        });
        
        // Wait for profile to load and then redirect
        setTimeout(() => {
          waitForProfileAndRedirect();
        }, 1000);
      }
    } catch (error) {
      console.error('Login exception:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(
        signupData.email, 
        signupData.password, 
        signupData.fullName,
        signupData.phone
      );
      
      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Redirecionando..."
        });
        
        // Wait for profile to load and then redirect
        setTimeout(() => {
          waitForProfileAndRedirect();
        }, 2000); // Longer wait for signup as profile needs to be created
      }
    } catch (error) {
      console.error('Signup exception:', error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signIn('admin@admin.com', '47316854v8');
      
      if (error) {
        console.error('Admin login error:', error);
        toast({
          title: "Erro no login de admin",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login de admin realizado!",
          description: "Redirecionando para área administrativa..."
        });
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Admin login exception:', error);
      toast({
        title: "Erro no login de admin",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isCorretorLogin ? 'Área do Corretor' : 'Área do Cliente'}
              </CardTitle>
              <CardDescription>
                {isCorretorLogin 
                  ? 'Acesse seu painel de corretor' 
                  : 'Entre ou cadastre-se para agendar visitas'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Admin Login Button */}
              <div className="mb-6 text-center">
                <Button 
                  onClick={handleAdminLogin}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {loading ? 'Entrando...' : 'Login Administrador'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Acesso rápido para administradores
                </p>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  {!isCorretorLogin && <TabsTrigger value="signup">Cadastrar</TabsTrigger>}
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      <LogIn className="h-4 w-4 mr-2" />
                      {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </TabsContent>
                
                {!isCorretorLogin && (
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome Completo</Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={signupData.phone}
                          onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Senha</Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                          required
                          minLength={6}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={loading}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                      </Button>
                    </form>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
