import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-bassini.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Static mock login
    setTimeout(() => {
      setLoading(false);
      if (email === "admin@bassini.com.br" && password === "admin123") {
        localStorage.setItem("is_authenticated", "true");
        navigate("/admin");
      } else {
        toast({ title: "Erro ao entrar", description: "Credenciais inválidas (Modo Estático)", variant: "destructive" });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <img src={logo} alt="Bassini Tecnologia" className="h-12 mx-auto mb-8" />
        <form onSubmit={handleLogin} className="bg-card p-6 rounded-lg shadow-sm border border-border space-y-4">
          <h1 className="text-xl font-semibold text-card-foreground text-center">Painel Admin (Demo)</h1>
          <p className="text-xs text-center text-muted-foreground">admin@bassini.com.br / admin123</p>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;

