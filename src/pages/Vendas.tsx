import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle, CheckCircle2, Zap, Shield, Rocket, Code2, Star,
  ArrowRight, Monitor, Smartphone, Search, Clock, HeartHandshake, TrendingUp,
  ChevronDown, ChevronUp, Globe, Palette, Settings, Eye
} from "lucide-react";
import logo from "@/assets/logo-bassini.png";
import Navbar from "@/components/Navbar";

const whatsappBase = "https://wa.me/5567993073133?text=";

const waMsg = (text: string) => `${whatsappBase}${encodeURIComponent(text)}`;

const whatsappUrl = waMsg("Olá! Vi a página da Bassini Tecnologia e quero saber mais sobre criação de sites.");
const waHero = waMsg("Olá! Quero ter um site profissional para o meu negócio. Podem me ajudar?");
const waLanding = waMsg("Olá! Tenho interesse no plano Landing Page (página única). Gostaria de saber o valor e os detalhes.");
  const waEssencial = waMsg("Olá! Tenho interesse no plano Essencial (até 3 páginas). Gostaria de saber o valor e os detalhes.");
  const waProfissional = waMsg("Olá! Quero o plano Profissional (até 5 páginas, SEO e painel admin). Qual o valor?");
  const waPremium = waMsg("Olá! Tenho interesse no plano Premium (até 7 páginas, animações e blog). Qual o investimento?");
const waFinalCta = waMsg("Olá! Estou decidido, quero criar meu site profissional com a Bassini. Vamos conversar!");

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 },
};

const stagger = (i: number) => ({
  ...fadeUp,
  transition: { duration: 0.5, delay: i * 0.1 },
});

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <span className="text-sm font-medium text-foreground">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

const Vendas = () => {
  return (
    <div id="top" className="min-h-screen bg-background scanlines">
      <Navbar />

      {/* ============ HERO ============ */}
      <header className="hero-section relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-20" />
        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={logo}
            alt="Bassini Tecnologia"
            className="h-20 md:h-32 mb-8 drop-shadow-[0_0_40px_hsl(195,100%,50%,0.2)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />

          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] text-accent uppercase tracking-wider">Oferta por tempo limitado</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-bold text-foreground mb-4 tracking-tight leading-tight">
            Tenha um site profissional que{" "}
            <span className="text-gradient">destaca seu negócio</span>{" "}
            na internet
          </h1>

          <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Pare de perder clientes por não estar na internet. Criamos seu site em poucos dias — moderno, rápido e pensado para trazer resultados reais.
          </p>

          <a
            href={waHero}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent/30 text-base md:text-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Quero meu site agora
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="flex items-center justify-center gap-4 mt-5 font-mono text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-accent" /> Orçamento grátis</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-accent" /> Sem compromisso</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-accent" /> Resposta em minutos</span>
          </div>
        </motion.div>
      </header>

      {/* ============ PROBLEM / PAIN ============ */}
      <section className="py-16 px-4 border-t border-border">
        <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Você está <span className="text-destructive">perdendo dinheiro</span> sem um site
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Enquanto você não está na internet, seus concorrentes estão conquistando os clientes que poderiam ser seus.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {[
              { emoji: "😰", text: "Clientes procuram no Google e não te encontram" },
              { emoji: "📉", text: "Você depende só de indicação boca a boca" },
              { emoji: "❌", text: "Perde credibilidade sem presença online" },
            ].map((item, i) => (
              <motion.div key={i} className="card-tech rounded-lg p-5" {...stagger(i)}>
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ SOLUTION ============ */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-20" />
        <motion.div className="relative z-10 max-w-3xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            A Bassini resolve isso <span className="text-gradient">pra você</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-10">
            Criamos sites profissionais que posicionam seu negócio na internet e fazem seus clientes te encontrarem.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Monitor, title: "Design Moderno", desc: "Visual profissional que transmite confiança e autoridade." },
            { icon: Smartphone, title: "100% Responsivo", desc: "Perfeito em celular, tablet e computador." },
            { icon: Zap, title: "Super Rápido", desc: "Carregamento otimizado para não perder visitantes." },
            { icon: Search, title: "Otimizado para Google", desc: "SEO para seu negócio aparecer nas buscas." },
            { icon: Shield, title: "Seguro (HTTPS)", desc: "Certificado SSL incluso para proteção dos dados." },
            { icon: Settings, title: "Painel Admin", desc: "Você mesmo gerencia o conteúdo do seu site." },
          ].map((item, i) => (
            <motion.div key={item.title} className="card-tech rounded-lg p-5 text-center" {...stagger(i)}>
              <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="py-16 px-4 border-t border-border">
        <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona? <span className="text-gradient">Simples.</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-10">Em 3 passos você tem seu site no ar:</p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { step: "01", title: "Você entra em contato", desc: "Me chama no WhatsApp, conta sobre o seu negócio e o que precisa.", icon: MessageCircle },
            { step: "02", title: "Eu crio seu site", desc: "Desenvolvo tudo — design, textos, responsividade e otimização.", icon: Code2 },
            { step: "03", title: "Seu site vai ao ar", desc: "Em poucos dias, seu negócio está na internet atraindo clientes.", icon: Rocket },
          ].map((item, i) => (
            <motion.div key={item.step} className="card-tech rounded-lg p-5 flex items-start gap-4" {...stagger(i)}>
              <div className="shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-primary">{item.step}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-primary" />
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ SOCIAL PROOF ============ */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-20" />
        <motion.div className="relative z-10 max-w-3xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-10">
            Quem já <span className="text-gradient">confia</span> na Bassini
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Helena M.", role: "Veterinária", text: "Meu consultório triplicou os agendamentos depois do site. Valeu cada centavo investido!" },
            { name: "Fabiana C.", role: "Nutricionista", text: "O site ficou lindo e profissional. Meus pacientes elogiam demais a facilidade de agendar." },
            { name: "Carlos R.", role: "Assistência Técnica", text: "Antes eu vivia só de indicação. Agora recebo pedidos de orçamento pelo site todo dia." },
            { name: "FORT Consultoria", role: "Seg. do Trabalho", text: "Precisávamos de credibilidade online. A Bassini entregou um site que impressiona nossos clientes." },
          ].map((t, i) => (
            <motion.div key={i} className="card-tech rounded-lg p-5" {...stagger(i)}>
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic mb-3 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section className="py-16 px-4 border-t border-border">
        <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Investimento que <span className="text-gradient">se paga</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-10">
            Um site profissional custa menos do que você imagina. Consulte valores personalizados:
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: "🚀 Landing Page",
              desc: "Página única focada em conversão",
              price: "R$ 497",
              installment: null,
              features: ["Design profissional", "1 página completa", "Responsivo", "Botão de WhatsApp", "Entrega em 3 dias"],
              highlight: false,
              waLink: waLanding,
              btnText: "Quero a Landing Page",
            },
            {
              name: "🥉 Essencial",
              desc: "Ideal para empresas que querem presença profissional",
              price: "R$ 997",
              installment: "ou 12x de R$ 83",
              features: ["Design profissional", "Até 3 páginas", "Responsivo", "Formulário de contato", "Integração com Google Maps", "Entrega em 5 dias"],
              highlight: false,
              waLink: waEssencial,
              btnText: "Quero o Essencial",
            },
            {
              name: "🥈 Profissional",
              desc: "O mais escolhido pelos clientes",
              price: "R$ 1.247",
              installment: "ou 12x de R$ 104",
              features: ["Tudo do Essencial", "Até 5 páginas", "SEO otimizado", "WhatsApp integrado", "Painel administrativo", "Entrega em 7 dias"],
              highlight: true,
              waLink: waProfissional,
              btnText: "Quero o Profissional",
            },
            {
              name: "🥇 Premium",
              desc: "Para quem quer o melhor",
              price: "R$ 1.747",
              installment: "ou 12x de R$ 146",
              features: ["Tudo do Profissional", "Até 7 páginas", "Animações avançadas", "Blog integrado", "Suporte prioritário", "Entrega em 10 dias"],
              highlight: false,
              waLink: waPremium,
              btnText: "Quero o Premium",
            },
          ].map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`card-tech rounded-xl p-6 text-center relative ${plan.highlight ? "border-primary/50 ring-1 ring-primary/20" : ""}`}
              {...stagger(i)}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full">
                  ⭐ MAIS POPULAR
                </div>
              )}
              <h3 className="text-base font-bold text-foreground mb-1 mt-2">{plan.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-3">{plan.desc}</p>
              <div className="mb-4">
                <span className="text-2xl font-bold text-gradient">{plan.price}</span>
                {plan.installment ? (
                  <p className="text-[10px] text-muted-foreground mt-1">{plan.installment}</p>
                ) : (
                  <p className="text-[10px] text-accent mt-1 font-semibold">à vista</p>
                )}
              </div>
              <div className="space-y-2 mb-6 text-left">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <a
                href={plan.waLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-lg transition-all text-sm w-full justify-center ${
                  plan.highlight
                    ? "bg-accent text-accent-foreground hover:brightness-110 shadow-lg shadow-accent/20"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                {plan.btnText}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ PORTFOLIO SHOWCASE ============ */}
      <section className="py-16 px-4 border-t border-border relative">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-20" />
        <motion.div className="relative z-10 max-w-3xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Não acredite só na nossa palavra. <span className="text-gradient">Veja os resultados</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
            Confira os sites que já entregamos para nossos clientes. Cada projeto é único e feito sob medida.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/30 text-base"
          >
            <Eye className="w-5 h-5" />
            Ver portfólio completo
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] text-muted-foreground mt-4 font-mono">
            +11 projetos entregues — clínicas, lojas, consultorias e mais
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-20" />
        <motion.div className="relative z-10 max-w-2xl mx-auto" {...fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Perguntas <span className="text-gradient">frequentes</span>
          </h2>
          <div className="space-y-3">
            <FaqItem q="Quanto tempo demora para ficar pronto?" a="Depende do plano, mas geralmente entre 5 a 10 dias úteis. Sites mais simples podem ficar prontos em até 3 dias." />
            <FaqItem q="Preciso pagar hospedagem?" a="Depende do projeto. Muitos sites que criamos usam plataformas com hospedagem gratuita inclusa. Vamos conversar sobre a melhor opção pra você." />
            <FaqItem q="Posso alterar o site depois?" a="Sim! Dependendo do plano, você terá um painel administrativo para editar textos, imagens e conteúdo sem precisar de conhecimento técnico." />
            <FaqItem q="Vocês fazem sites para qualquer tipo de negócio?" a="Sim! Já criamos sites para clínicas, nutricionistas, lojas, assistências técnicas, consultorias e muito mais." />
            <FaqItem q="Como funciona o pagamento?" a="Combinamos tudo pelo WhatsApp. Aceitamos PIX e parcelamento. O pagamento é feito de forma transparente e segura." />
          </div>
        </motion.div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-20 px-4 border-t border-border relative">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-30" />
        <motion.div
          className="relative z-10 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-full px-4 py-1.5 mb-6">
            <Clock className="w-3.5 h-3.5 text-destructive" />
            <span className="font-mono text-[10px] text-destructive uppercase tracking-wider">Não deixe pra depois</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Cada dia sem site é um dia <span className="text-destructive">perdendo clientes</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
            Seus concorrentes já estão na internet. A pergunta é: quando você vai estar?
          </p>

          <a
            href={waFinalCta}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold px-10 py-4 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent/30 text-base md:text-lg"
          >
            <MessageCircle className="w-6 h-6" />
            Quero meu site profissional
          </a>

          <div className="flex items-center justify-center gap-4 mt-6 font-mono text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><HeartHandshake className="w-3 h-3 text-accent" /> Atendimento humanizado</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-accent" /> Resultados reais</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative text-center py-8 border-t border-border">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">©</span> {new Date().getFullYear()} Bassini Tecnologia
          <span className="text-muted-foreground/40 mx-2">|</span>
          Todos os direitos reservados
        </p>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={whatsappUrl}
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

export default Vendas;
