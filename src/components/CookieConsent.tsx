import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const storageKey = "cookieConsent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem(storageKey);
    setVisible(value !== "accepted");
  }, []);

  const accept = () => {
    localStorage.setItem(storageKey, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4">
      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card/95 backdrop-blur p-4 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Usamos cookies e armazenamento local para funcionalidades essenciais (ex.: login do painel) e para melhorar a experiência.
            <span className="ml-1">
              <Link to="/privacidade" className="underline text-foreground hover:text-primary transition-colors">
                Ver política de privacidade
              </Link>
              .
            </span>
          </p>
          <button
            type="button"
            onClick={accept}
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:brightness-110 transition-all"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
