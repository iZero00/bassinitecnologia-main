import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-bassini.png";

const waUrl = "https://wa.me/5567993073133?text=" + encodeURIComponent("Olá! Vim pelo site da Bassini Tecnologia e gostaria de saber mais sobre criação de sites.");

const navLinks = [
  { to: "/#top", label: "Início" },
  { to: "/vendas#top", label: "Planos" },
  { to: "/cases#top", label: "Cases" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const activePath = pathname === "/" ? "/#top" : `${pathname}#top`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Bassini Tecnologia" className="h-8" />
          <span className="font-bold text-sm text-foreground hidden sm:block">Bassini <span className="text-gradient">Tecnologia</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
              className={`text-sm font-medium transition-colors ${
                activePath === link.to ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Orçamento
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-1">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => { setOpen(false); window.scrollTo({ top: 0, left: 0, behavior: "smooth" }); }}
                  className={`text-sm font-medium py-2.5 px-3 rounded-lg transition-colors ${
                    activePath === link.to ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-4 py-2.5 rounded-lg text-sm mt-1 justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                Solicitar Orçamento
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
