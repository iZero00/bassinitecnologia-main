import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { canonicalForCurrentRoute, setCanonical, setMetaName, setMetaProperty, setTitle } from "@/lib/seo";

const Privacidade = () => {
  useEffect(() => {
    const title = "Política de Privacidade | Bassini Tecnologia";
    const description =
      "Entenda como a Bassini Tecnologia trata dados pessoais, cookies e armazenamento local, conforme a LGPD.";

    setTitle(title);
    setMetaName("description", description);
    setMetaName("robots", "index,follow");
    setCanonical(canonicalForCurrentRoute());

    setMetaProperty("og:title", title);
    setMetaProperty("og:description", description);
    setMetaProperty("og:url", canonicalForCurrentRoute());
  }, []);

  return (
    <div id="top" className="min-h-screen bg-background scanlines">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
          Política de <span className="text-gradient">Privacidade</span>
        </h1>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Esta página descreve como a Bassini Tecnologia coleta, usa e protege dados pessoais em conformidade com a LGPD
            (Lei nº 13.709/2018).
          </p>

          <h2 className="text-base font-semibold text-foreground">1) Dados que podemos tratar</h2>
          <p>
            Podemos tratar dados fornecidos por você em atendimentos e solicitações de orçamento (ex.: nome, e-mail, telefone, informações do seu
            negócio e conteúdo enviado).
          </p>

          <h2 className="text-base font-semibold text-foreground">2) Finalidades</h2>
          <p>
            Usamos os dados para responder solicitações, elaborar propostas, prestar suporte, executar serviços contratados e cumprir obrigações
            legais.
          </p>

          <h2 className="text-base font-semibold text-foreground">3) Cookies e armazenamento local</h2>
          <p>
            Este site pode utilizar armazenamento local/cookies essenciais para funcionamento (por exemplo, manter sua sessão no painel
            administrativo quando aplicável). Você pode limpar cookies e dados do navegador a qualquer momento.
          </p>

          <h2 className="text-base font-semibold text-foreground">4) Compartilhamento</h2>
          <p>
            Quando necessário, podemos usar provedores de infraestrutura e ferramentas para operar o site e o painel (por exemplo, hospedagem,
            banco de dados e autenticação). Esses provedores atuam para viabilizar a operação e segurança do serviço.
          </p>

          <h2 className="text-base font-semibold text-foreground">5) Segurança</h2>
          <p>
            Aplicamos medidas técnicas e organizacionais para proteger dados contra acessos não autorizados, perda e uso indevido. Nenhum sistema é
            100% seguro, mas buscamos reduzir riscos continuamente.
          </p>

          <h2 className="text-base font-semibold text-foreground">6) Seus direitos</h2>
          <p>
            Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação e informações sobre
            compartilhamento. Para exercer seus direitos, entre em contato pelos canais disponíveis no site.
          </p>

          <h2 className="text-base font-semibold text-foreground">7) Atualizações</h2>
          <p>
            Podemos atualizar esta política periodicamente. Recomendamos revisá-la de tempos em tempos.
          </p>
        </div>
      </main>

      <footer className="relative text-center py-8 border-t border-border">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">©</span> {new Date().getFullYear()} Bassini Tecnologia
          <span className="text-muted-foreground/40 mx-2">|</span>
          Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
};

export default Privacidade;
