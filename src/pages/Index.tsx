import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { portfolioSites, type Site } from "@/data/portfolio";
import {
  ArrowUpRight, Terminal, Code2, MessageCircle, Zap, Shield, Rocket,
  CheckCircle2, ArrowRight, Search, Heart, Globe, Smartphone, Users,
  Star, Mail, MapPin, Stethoscope, UtensilsCrossed, Dumbbell, Scale,
  Wrench, Building2, PawPrint
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import logo from "@/assets/logo-bassini.png";

const waUrl = "https://wa.me/5567993073133?text=" + encodeURIComponent("Olá! Vim pelo site da Bassini Tecnologia e gostaria de saber mais sobre criação de sites.");
const waOrcamento = "https://wa.me/5567993073133?text=" + encodeURIComponent("Olá! Gostaria de solicitar um orçamento para criação de site profissional.");

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

const SiteCard = ({ site, index }: { site: Site; index: number }) => {
  const formattedUrl = site.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const previewImage = site.image_url || `https://image.thum.io/get/width/1280/crop/720/noanimate/${site.url}`;
  const waStyleUrl = "https://wa.me/5567993073133?text=" + encodeURIComponent(`Olá! Vi o site "${site.title}" nos cases da Bassini Tecnologia e gostei desse estilo! Quero algo parecido para o meu negócio.`);

  return (
    <div className="group card-tech rounded-lg overflow-hidden h-full flex flex-col">
      <a href={site.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border-b border-border">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground truncate flex-1">{formattedUrl}</span>
        </div>
        <div className="aspect-video bg-muted overflow-hidden relative">
          {previewImage ? (
            <>
              <img src={previewImage} alt={site.title} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
              <div className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-md border border-border bg-card/80 px-2 py-1 text-[10px] font-mono text-muted-foreground backdrop-blur-sm">
                <Code2 className="w-3 h-3 text-primary" />
                Preview do projeto
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.18),transparent_45%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)))] px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground line-clamp-2">{site.title}</p>
                <p className="text-[11px] font-mono text-muted-foreground break-all">{formattedUrl}</p>
              </div>
              <span className="rounded-md border border-border bg-card/70 px-2 py-1 text-[10px] font-mono text-muted-foreground">Clique para abrir o site</span>
            </div>
          )}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 flex items-center justify-center">
            <div className="w-11 h-11 rounded-md bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-lg shadow-primary/30">
              <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </a>
      <div className="p-4 mt-auto flex flex-col gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">{site.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed min-h-[2.5rem]">{site.description || "\u00A0"}</p>
        </div>
        <a
          href={waStyleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-accent text-accent-foreground font-semibold text-xs py-2.5 rounded-lg hover:brightness-110 transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Gostei desse estilo!
        </a>
      </div>
    </div>
  );
};

const Index = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      // Mock data from static file
      const shuffled = [...portfolioSites].sort(() => Math.random() - 0.5);
      setSites(shuffled);
      setLoading(false);
    };
    fetchSites();
  }, []);

  return (
    <div id="top" className="min-h-screen bg-background scanlines">
      <Navbar />

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
              <span><span className="text-accent">{sites.length}</span> projetos</span>
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
            Alguns sites que <span className="text-gradient">já desenvolvemos</span>
          </SectionTitle>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-tech rounded-lg h-64 w-full max-w-sm animate-pulse" />
              ))}
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-16">
              <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-mono text-sm">
                <span className="text-primary">$</span> Nenhum projeto cadastrado ainda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {sites.map((site, index) => (
                <motion.div
                  key={site.id}
                  className="w-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SiteCard site={site} index={index} />
                </motion.div>
              ))}
            </div>
          )}
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

      {/* ═══════════ 8. CONTATO ═══════════ */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="relative z-10 max-w-3xl mx-auto">
          <SectionTitle sub="Fale conosco e tire suas dúvidas.">
            Entre em <span className="text-gradient">contato</span>
          </SectionTitle>
          <div className="card-tech rounded-xl p-6 md:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                { icon: MessageCircle, label: "WhatsApp", value: "(67) 99307-3133", href: waUrl },
                { icon: Mail, label: "Email", value: "contato@bassini.dev", href: "mailto:contato@bassini.dev" },
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
        <div className="flex flex-col items-center gap-2">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">©</span> {new Date().getFullYear()} Bassini Tecnologia
            <span className="text-muted-foreground/40 mx-2">|</span>
            Todos os direitos reservados
          </p>
          <Link to="/auth" className="text-[10px] font-mono text-muted-foreground/30 hover:text-primary transition-colors">
            Acesso Restrito
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
