import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, LogOut, ExternalLink, Loader2, Globe } from "lucide-react";
import logo from "@/assets/logo-bassini.png";

interface Site {
  id: string;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
}

const Admin = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);
      fetchSites();
    };
    checkAuth();
  }, [navigate]);

  const fetchSites = async () => {
    const { data } = await supabase
      .from("portfolio_sites")
      .select("*")
      .order("created_at", { ascending: false });
    setSites(data || []);
  };

  const fetchMetadata = useCallback(async (inputUrl: string) => {
    if (!inputUrl || (!inputUrl.startsWith("http://") && !inputUrl.startsWith("https://"))) return;
    
    setFetching(true);
    setPreviewUrl(inputUrl);

    try {
      const { data, error } = await supabase.functions.invoke("scrape-metadata", {
        body: { url: inputUrl },
      });

      if (!error && data?.success && data.data) {
        if (data.data.title && !title) setTitle(data.data.title);
        if (data.data.description && !description) setDescription(data.data.description);
        if (data.data.image) setImageUrl(data.data.image);
      }
    } catch (err) {
      console.error("Error fetching metadata:", err);
    } finally {
      setFetching(false);
    }
  }, [title, description]);

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
    if (!userId) return;
    setLoading(true);

    const { data: inserted, error } = await supabase.from("portfolio_sites").insert({
      title,
      description: description || null,
      url,
      image_url: imageUrl,
      user_id: userId,
    }).select().single();

    if (error) {
      setLoading(false);
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Site adicionado!" });

    // Auto-capture screenshot if no image was detected
    if (!imageUrl && inserted) {
      toast({ title: "📸 Capturando capa automática...", description: "Aguarde alguns segundos." });
      try {
        const { data: capData } = await supabase.functions.invoke("capture-screenshot", {
          body: { url, site_id: inserted.id },
        });
        if (capData?.success) {
          toast({ title: "✅ Capa gerada!", description: "A imagem do site foi salva automaticamente." });
        }
      } catch (err) {
        console.error("Screenshot capture error:", err);
      }
    }

    setTitle("");
    setDescription("");
    setUrl("");
    setImageUrl(null);
    setPreviewUrl(null);
    setLoading(false);
    fetchSites();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("portfolio_sites").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Site removido" });
      fetchSites();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
