import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { canonicalForCurrentRoute, setCanonical, setMetaName, setMetaProperty, setTitle } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    const title = "Página não encontrada | Bassini Tecnologia";
    setTitle(title);
    setMetaName("robots", "noindex,follow,noarchive");
    setCanonical(canonicalForCurrentRoute());
    setMetaProperty("og:title", title);
    setMetaProperty("og:url", canonicalForCurrentRoute());
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
