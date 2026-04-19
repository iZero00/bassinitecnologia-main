import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, LogOut, ExternalLink, Loader2, Globe } from "lucide-react";
import logo from "@/assets/logo-bassini.png";
import { z } from "zod";
import { portfolioSites, type Site } from "@/data/portfolio";

const siteSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres").max(100, "Título muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  url: z.string().url("URL inválida").startsWith("http", "URL deve começar com http ou https"),
});

const Admin = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = localStorage.getItem("is_authenticated") === "true";
      if (!isAuth) {
        navigate("/auth");
        return;
      }
      // Load initial sites from static file
      setSites(portfolioSites);
    };
    checkAuth();
  }, [navigate]);

  const fetchMetadata = useCallback(async (inputUrl: string) => {
    if (!inputUrl || (!inputUrl.startsWith("http://") && !inputUrl.startsWith("https://"))) return;
    
    setFetching(true);
    setPreviewUrl(inputUrl);

    // Mock metadata fetching
    setTimeout(() => {
      setFetching(false);
      toast({ title: "Modo Offline", description: "Busca de metadados simulada para demonstração." });
    }, 1000);
  }, [toast]);

  // Debounce URL input
  useEffect(() => {
    if (!url) {
      setPreviewUrl(null);
      setImageUrl(null);
      return;
    }
    const timeout = setTimeout(() => {
      fetchMetadata(url);
    }, 800);
    return () => clearTimeout(timeout);
  }, [url, fetchMetadata]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate data
    const validation = siteSchema.safeParse({ title, description, url });
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message).join(", ");
      toast({ title: "Erro de validação", description: errors, variant: "destructive" });
      return;
    }

    setLoading(true);

    // Mock add to local state
    setTimeout(() => {
      const newSite: Site = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description?.trim() || null,
        url: url.trim(),
        image_url: imageUrl || `https://image.thum.io/get/width/1280/crop/720/noanimate/${url}`,
      };

      setSites(prev => [newSite, ...prev]);
      toast({ title: "Site adicionado (Demo)", description: "Isso ficará visível apenas nesta sessão." });

      setTitle("");
      setDescription("");
      setUrl("");
      setImageUrl(null);
      setPreviewUrl(null);
      setLoading(false);
    }, 500);
  };

  const handleDelete = async (id: string) => {
    setSites(prev => prev.filter(s => s.id !== id));
    toast({ title: "Site removido (Demo)" });
  };

  const handleLogout = async () => {
    localStorage.removeItem("is_authenticated");
    navigate("/");
  };


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={logo} alt="Bassini Tecnologia" className="h-8" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Add form */}
        <form onSubmit={handleAdd} className="bg-card p-6 rounded-lg border border-border space-y-4">
          <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Plus className="w-5 h-5" /> Adicionar Site
          </h2>

          <div className="relative">
            <Input
              placeholder="Cole a URL do site (ex: https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            {fetching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Live preview */}
          {previewUrl && (
            <div className="rounded-lg border border-border overflow-hidden bg-muted">
              <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">{previewUrl}</span>
              </div>
              <div className="aspect-video relative">
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                  title="Preview do site"
                />
              </div>
            </div>
          )}

          <Input
            placeholder="Nome do site"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {imageUrl && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <img src={imageUrl} alt="OG preview" className="w-16 h-10 object-cover rounded" />
              <span className="text-xs text-muted-foreground flex-1 truncate">Imagem detectada automaticamente</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => setImageUrl(null)}>
                Remover
              </Button>
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Adicionando..." : "Adicionar"}
          </Button>
        </form>

        {/* Sites list */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Sites cadastrados ({sites.length})</h2>
          {sites.length === 0 ? (
            <p className="text-muted-foreground">Nenhum site cadastrado.</p>
          ) : (
            sites.map((site) => (
              <div key={site.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                {site.image_url ? (
                  <img src={site.image_url} alt={site.title} className="w-20 h-14 object-cover rounded" />
                ) : (
                  <div className="w-20 h-14 bg-muted rounded flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-card-foreground truncate">{site.title}</h3>
                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">
                    {site.url}
                  </a>
                </div>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(site.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
