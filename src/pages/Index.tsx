import CommercialContent from "@/components/CommercialContent";
import { usePublicContent } from "@/hooks/use-public-content";
import { whatsappLink } from "@/lib/cms";
import Catalog from "@/components/Catalog";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, Terminal, Code2, MessageCircle, Zap, Shield, Rocket,
  CheckCircle2, ArrowRight, Search, Heart, Globe, Smartphone, Users,
  Star, Mail, MapPin, Stethoscope, UtensilsCrossed, Dumbbell, Scale,
  Wrench, Building2, PawPrint
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import logo from "@/assets/logo-bassini.png";
import { canonicalForCurrentRoute, setCanonical, setMetaName, setMetaProperty, setTitle } from "@/lib/seo";

const SectionTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
  <div className="text-center mb-12">
    <motion.h2
      className="text-2xl md:text-4xl font-bold text-foreground mb-3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.h2>
    {sub && (
      <motion.p
        className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        {sub}
      </motion.p>
    )}
  </div>
);

const Index = () => {
  const { settings, rows } = usePublicContent();
  const waUrl=whatsappLink(settings,"Olá! Vim pelo site da Bassini Tecnologia e gostaria de saber mais sobre criação de sites.") || "#planos";
  const waOrcamento=whatsappLink(settings,"Olá! Gostaria de solicitar um orçamento para criação de site profissional.") || "#planos";



  useEffect(() => {
    const title = "Bassini Tecnologia | Criação de Sites Profissionais";
    const description =
      "Criação de sites profissionais, rápidos e otimizados para Google. Veja cases e solicite um orçamento pelo WhatsApp.";

    setTitle(title);
    setMetaName("description", description);
    setMetaName("robots", "index,follow,max-image-preview:large");
    setCanonical(canonicalForCurrentRoute());

    setMetaProperty("og:type", "website");
    setMetaProperty("og:title", title);
    setMetaProperty("og:description", description);
    setMetaProperty("og:url", canonicalForCurrentRoute());
    setMetaProperty("og:image", `${window.location.origin}/placeholder.svg`);

    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", title);
    setMetaName("twitter:description", description);
    setMetaName("twitter:image", `${window.location.origin}/placeholder.svg`);
  }, []);


  return (
    <div id="top" className="min-h-screen bg-background scanlines">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                name: "Bassini Tecnologia",
                url: window.location.origin,
                email: settings?.email || undefined,
                telephone: settings?.whatsapp || undefined,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Araçatuba",
                  addressRegion: "SP",
                  addressCountry: "BR",
                },
              },
              {
                "@type": "WebSite",
                name: "Bassini Tecnologia",
                url: window.location.origin,
              },
            ],
          }),
        }}
      />

      {/* ═══════════ 1. HERO ═══════════ */}
      <header className="hero-section pt-28 pb-16 md:pt-36 md:pb-24 px-4 text-center relative">
        <motion.div
          className="relative z-10 flex flex-col items-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={logo}
            alt="Bassini Tecnologia"
            width={144}
            height={144}
            loading="eager"
            decoding="async"
            className="h-24 md:h-36 mb-8 drop-shadow-[0_0_40px_hsl(195,100%,50%,0.2)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />

          <motion.div
            className="inline-flex items-center gap-2 bg-secondary/60 border border-border rounded-md px-4 py-2 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">
              ~/bassini<span className="text-primary">/projetos</span><span className="cursor-blink text-primary">_</span>
            </span>
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">
            Criamos Sites Profissionais que Fazem Sua Empresa{" "}
            <span className="text-gradient">Vender Mais</span>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Desenvolvemos sites modernos, rápidos e otimizados para Google para empresas que querem atrair mais clientes pela internet.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href={waOrcamento}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-8 py-3.5 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-accent/20 text-base"
            >
              <MessageCircle className="w-5 h-5" /> Solicitar Orçamento
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 border border-border bg-secondary/50 text-foreground font-semibold px-8 py-3.5 rounded-lg hover:bg-secondary transition-all text-base"
            >
              Ver Portfólio <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <motion.div
            className="flex items-center gap-6 mt-10 font-mono text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span><span className="text-accent">{rows.filter(row => row.resource === "projects").length}</span> projetos</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>status: <span className="text-primary">online</span></span>
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* ═══════════ 2. PARA QUEM É ═══════════ */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <SectionTitle sub="Se você se encaixa em algum desses segmentos, podemos ajudar.">
            Criamos sites para <span className="text-gradient">empresas como</span>
          </SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: Stethoscope, label: "Clínicas e profissionais da saúde" },
              { icon: PawPrint, label: "Veterinárias" },
              { icon: UtensilsCrossed, label: "Restaurantes e lanchonetes" },
              { icon: Dumbbell, label: "Academias" },
              { icon: Scale, label: "Advogados" },
              { icon: Building2, label: "Empresas locais" },
              { icon: Wrench, label: "Prestadores de serviço" },
              { icon: Users, label: "Profissionais autônomos" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="card-tech rounded-lg p-4 flex flex-col items-center text-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground leading-snug">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 3. BENEFÍCIOS ═══════════ */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="relative z-10 max-w-5xl mx-auto">
          <SectionTitle sub="Um site profissional é o vendedor que trabalha por você o tempo todo.">
            Por que sua empresa precisa de um{" "}
            <span className="text-gradient">site profissional</span>?
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Search, title: "Apareça no Google", desc: "Seus clientes pesquisam no Google antes de comprar. Esteja lá quando eles procurarem." },
              { icon: Shield, title: "Mais credibilidade", desc: "Um site profissional transmite confiança e autoridade para o seu negócio." },
              { icon: Globe, title: "Receba clientes 24h", desc: "Seu site apresenta sua empresa e recebe contatos mesmo fora do horário comercial." },
              { icon: Zap, title: "Site rápido e responsivo", desc: "Velocidade de carregamento e adaptação perfeita em celulares e desktops." },
              { icon: MessageCircle, title: "Integração com WhatsApp", desc: "Botões e links diretos para o WhatsApp facilitam o contato imediato." },
              { icon: Rocket, title: "Otimizado para conversão", desc: "Design estratégico pensado para transformar visitantes em clientes." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="card-tech rounded-lg p-6 flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 4. PORTFÓLIO ═══════════ */}
      <section id="portfolio" className="relative py-20 md:py-28 px-4">
        <div className="absolute inset-0 grid-dots pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <SectionTitle sub="Cada projeto é único, pensado para destacar o negócio do cliente.">
            Projetos que <span className="text-gradient">já desenvolvemos</span>
          </SectionTitle>
          <Catalog />
        </div>
      </section>

      {/* ═══════════ 5. COMO FUNCIONA ═══════════ */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <SectionTitle sub="Um processo simples e transparente, do início ao resultado.">
            Como funciona o <span className="text-gradient">desenvolvimento</span> do seu site
          </SectionTitle>
          <div className="space-y-0">
            {[
              { step: "01", title: "Conversamos sobre seu projeto", desc: "Entendemos seu negócio, público e objetivos para criar a melhor estratégia." },
              { step: "02", title: "Criamos o design do site", desc: "Desenvolvemos um layout moderno e personalizado para sua empresa." },
              { step: "03", title: "Desenvolvemos a estrutura", desc: "Programamos o site com tecnologias modernas, rápido e responsivo." },
              { step: "04", title: "Publicamos o site online", desc: "Colocamos seu site no ar com domínio próprio e configurações de SEO." },
              { step: "05", title: "Seu site começa a gerar clientes", desc: "Com o site ativo, você passa a receber contatos pela internet." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="flex gap-4 md:gap-6 items-start relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <span className="font-mono text-xs font-bold text-primary">{item.step}</span>
                  </div>
                  {i < 4 && <div className="w-px h-12 bg-border" />}
                </div>
                <div className="pb-8">
                  <h3 className="text-sm md:text-base font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 6. PROVA SOCIAL / DEPOIMENTOS ═══════════ */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="relative z-10 max-w-5xl mx-auto">
          <SectionTitle sub="A opinião de quem já confiou na Bassini Tecnologia.">
            O que nossos <span className="text-gradient">clientes dizem</span>
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Dr. Thor Suplementos",
                text: "A Bassini criou um site incrível para nossa loja. As vendas online aumentaram significativamente!",
              },
              {
                name: "Burger Venezuelano",
                text: "Site ficou profissional, moderno e meus clientes adoraram. Super recomendo!",
              },
              {
                name: "Cliente Satisfeito",
                text: "Entrega rápida e qualidade excelente. O site ficou exatamente como eu queria.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="card-tech rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <blockquote className="text-sm text-muted-foreground italic mb-4 leading-relaxed">
                  "{t.text}"
                </blockquote>
                <p className="text-xs font-semibold text-foreground font-mono">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 7. DIFERENCIAIS ═══════════ */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <SectionTitle>
            Diferenciais da <span className="text-gradient">Bassini Tecnologia</span>
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Zap, label: "Design moderno e exclusivo" },
              { icon: Rocket, label: "Sites rápidos e otimizados" },
              { icon: Search, label: "Otimizados para Google (SEO)" },
              { icon: MessageCircle, label: "Integração com WhatsApp" },
              { icon: Heart, label: "Suporte pós-entrega" },
              { icon: Smartphone, label: "100% responsivo (mobile)" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="card-tech rounded-lg p-5 flex items-center gap-4"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CommercialContent />

      {/* ═══════════ 8. CONTATO ═══════════ */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="relative z-10 max-w-3xl mx-auto">
          <SectionTitle sub="Fale conosco e tire suas dúvidas.">
            Entre em <span className="text-gradient">contato</span>
          </SectionTitle>
          <div className="card-tech rounded-xl p-6 md:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                { icon: MessageCircle, label: "WhatsApp", value: settings?.whatsapp || "Consulte nossos planos", href: waUrl },
                { icon: Mail, label: "Email", value: String(settings?.email || "Contato pelo WhatsApp"), href: settings?.email ? `mailto:${String(settings.email)}` : waUrl },
                { icon: MapPin, label: "Cidade", value: "Araçatuba – SP", href: null },
              ].map((c) => (
                <div key={c.label} className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <c.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                      {c.value}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-foreground">{c.value}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <a
                href={waOrcamento}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-8 py-3.5 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-accent/20 text-base"
              >
                <MessageCircle className="w-5 h-5" /> Solicitar Orçamento Agora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 9. CTA FINAL ═══════════ */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-50" />
        <motion.div
          className="relative z-10 max-w-2xl mx-auto text-center card-tech rounded-xl p-8 md:p-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-md px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] text-accent uppercase tracking-wider">Vagas limitadas</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Seu negócio precisa de um{" "}
            <span className="text-gradient">site profissional</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-md mx-auto">
            Entre em contato agora e receba um orçamento sem compromisso. Não fique para trás — seus concorrentes já estão na internet.
          </p>
          <a
            href={waOrcamento}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold px-10 py-4 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-accent/20 text-lg"
          >
            🚀 Quero meu site profissional
          </a>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 font-mono text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-accent" /> Orçamento grátis</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-accent" /> Sem compromisso</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-accent" /> Resposta rápida</span>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative text-center py-8 border-t border-border">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">©</span> {new Date().getFullYear()} Bassini Tecnologia
          <span className="text-muted-foreground/40 mx-2">|</span>
          Todos os direitos reservados
        </p>
        <div className="mt-2">
          <Link to="/privacidade" className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors">
            Política de Privacidade
          </Link>
        </div>
      </footer>

      {/* ═══════════ WHATSAPP FLUTUANTE ═══════════ */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg shadow-accent/30 hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};

export default Index;
