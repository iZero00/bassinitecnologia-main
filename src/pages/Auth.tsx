import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-bassini.png";
import { canonicalForCurrentRoute, setCanonical, setMetaName, setMetaProperty, setTitle } from "@/lib/seo";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const title = "Acesso Admin | Bassini Tecnologia";
    setTitle(title);
    setMetaName("robots", "noindex,nofollow,noarchive");
    setCanonical(canonicalForCurrentRoute());
    setMetaProperty("og:title", title);
    setMetaProperty("og:url", canonicalForCurrentRoute());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedUntil && Date.now() < lockedUntil) {
      toast({ title: "Aguarde", description: "Muitas tentativas. Tente novamente em instantes.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setFailedAttempts((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          setLockedUntil(Date.now() + 60_000);
          return 0;
        }
        return next;
      });
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    } else {
      setFailedAttempts(0);
      setLockedUntil(null);
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <img src={logo} alt="Bassini Tecnologia" className="h-12 mx-auto mb-8" />
        <form onSubmit={handleLogin} className="bg-card p-6 rounded-lg shadow-sm border border-border space-y-4">
          <h1 className="text-xl font-semibold text-card-foreground text-center">Painel Admin</h1>
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
