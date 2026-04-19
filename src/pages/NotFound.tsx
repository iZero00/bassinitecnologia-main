import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Terminal, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background scanlines flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background elements to match theme */}
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            
            <motion.div
              className="inline-flex items-center gap-2 bg-secondary/60 border border-border rounded-md px-3 py-1.5 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono text-[10px] text-muted-foreground">
                error<span className="text-destructive">_404</span>: route_not_found<span className="cursor-blink text-primary">_</span>
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tighter">
              404
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Ops! Parece que essa página se perdeu no código. O link que você tentou acessar não existe.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
              <Home className="w-4 h-4" />
              Voltar ao Início
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary text-foreground font-semibold px-6 py-3 rounded-lg hover:bg-secondary/80 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Página Anterior
            </button>
          </motion.div>

          <motion.p 
            className="mt-12 font-mono text-[10px] text-muted-foreground/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            PATH: {location.pathname}
          </motion.p>
        </div>
      </main>

      {/* Footer minimal for 404 */}
      <footer className="py-8 text-center border-t border-border/50">
        <p className="font-mono text-[10px] text-muted-foreground/30">
          © {new Date().getFullYear()} Bassini Tecnologia | Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
};

export default NotFound;

