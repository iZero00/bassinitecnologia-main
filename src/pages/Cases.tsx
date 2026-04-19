import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { portfolioSites, type Site } from "@/data/portfolio";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Code2, Star, TrendingUp, Users, Globe,
  MessageCircle, ArrowRight, BarChart3, Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";

const waUrl = "https://wa.me/5567993073133?text=" + encodeURIComponent("Olá! Vi os cases da Bassini Tecnologia e quero um site assim para o meu negócio!");

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 },
};

const testimonials = [
  { name: "Helena M.", role: "Veterinária", text: "Meu consultório triplicou os agendamentos depois do site. Valeu cada centavo investido!" },
  { name: "Fabiana C.", role: "Nutricionista", text: "O site ficou lindo e profissional. Meus pacientes elogiam demais a facilidade de agendar." },
  { name: "Carlos R.", role: "Assistência Técnica", text: "Antes eu vivia só de indicação. Agora recebo pedidos de orçamento pelo site todo dia." },
  { name: "FORT Consultoria", role: "Seg. do Trabalho", text: "Precisávamos de credibilidade online. A Bassini entregou um site que impressiona nossos clientes." },
];

const metrics = [
  { icon: Users, value: "+11", label: "Projetos entregues" },
  { icon: Star, value: "5.0", label: "Avaliação média" },
  { icon: TrendingUp, value: "3x", label: "Mais clientes" },
  { icon: Globe, value: "100%", label: "Taxa de satisfação" },
];

const Cases = () => {
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

      {/* Hero */}
      <header className="hero-section pt-28 pb-16 md:pt-36 md:pb-24 px-4 text-center relative">
        <motion.div
          className="relative z-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Resultados comprovados</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">
            Veja os <span className="text-gradient">resultados reais</span> dos nossos clientes
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Cada projeto é único. Confira os sites que já transformaram negócios e trouxeram resultados concretos.
          </p>
        </motion.div>
      </header>

      {/* Metrics */}
      <section className="py-12 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="card-tech rounded-lg p-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <m.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-foreground">{m.value}</p>
              <p className="text-[11px] text-muted-foreground font-mono">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-20" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
              Projetos <span className="text-gradient">entregues</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Sites que já estão no ar gerando resultados para nossos clientes.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="card-tech rounded-lg h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site, index) => {
                const formattedUrl = site.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
                const previewImage = site.image_url || `https://image.thum.io/get/width/1280/crop/720/noanimate/${site.url}`;

                const waStyleUrl = "https://wa.me/5567993073133?text=" + encodeURIComponent(`Olá! Vi o site "${site.title}" nos cases da Bassini Tecnologia e gostei desse estilo! Quero algo parecido para o meu negócio.`);

                return (
                  <motion.div
                    key={site.id}
                    className="group card-tech rounded-lg overflow-hidden flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
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
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.18),transparent_45%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)))] px-4 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                              <Code2 className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm font-semibold text-foreground line-clamp-2">{site.title}</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-11 h-11 rounded-md bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-lg shadow-primary/30">
                            <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      <div>
                        <h3 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">{site.title}</h3>
                        {site.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{site.description}</p>}
                      </div>
                      <a
                        href={waStyleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-accent text-accent-foreground font-semibold text-xs py-2.5 rounded-lg hover:brightness-110 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Gostei desse estilo!
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
              O que nossos clientes <span className="text-gradient">dizem</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="card-tech rounded-lg p-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-border relative">
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-30" />
        <motion.div className="relative z-10 max-w-2xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Quer resultados <span className="text-gradient">assim</span> para o seu negócio?
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
            Converse com a gente e descubra como podemos transformar sua presença online.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent/30 text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Quero meu site agora
            </a>
            <Link
              to="/vendas"
              className="inline-flex items-center gap-2 bg-secondary text-foreground font-semibold px-8 py-4 rounded-xl hover:bg-secondary/80 transition-all text-base"
            >
              Ver planos e preços
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
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

      {/* Floating WhatsApp */}
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

export default Cases;
