import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { publicEntries, safeUrl, whatsappLink, type PublicEntry, type Payload } from "@/lib/cms";
import ProjectPreview from "./ProjectPreview";
export default function Catalog() {
    const [rows, setRows] = useState<PublicEntry[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [area, setArea] = useState("");
    const [preview, setPreview] = useState<Payload | null>(null);
    const load = () => { setLoading(true); setError(""); publicEntries().then(setRows).catch(() => setError("Não foi possível carregar o catálogo. Tente novamente.")).finally(() => setLoading(false)); };
    useEffect(load, []);
    const settings = rows.find(r => r.resource === "settings")?.payload;
    const projects = rows.filter(r => r.resource === "projects");
    const categories = rows.filter(r => r.resource === "categories");
    // cms_public contains only published, non-archived projects.
    const linkedAreaIds = new Set(projects.flatMap(project => project.payload.areas || []));
    const areas = rows.filter(r => r.resource === "areas" && linkedAreaIds.has(r.id));
    const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const filtered = projects.filter(({ payload: p }) => (!query || normalize(`${p.title} ${p.description || ""} ${categories.filter(c => p.categories?.includes(c.id)).map(c => c.payload.title).join(" ")}`).includes(normalize(query))) && (!category || p.categories?.includes(category)) && (!area || p.areas?.includes(area)));
    return <div className="space-y-6">
    <div className="grid sm:grid-cols-3 gap-3">
    <Input aria-label="Buscar projetos" placeholder="Buscar projetos..." value={query} onChange={e => setQuery(e.target.value)}/>
    <select aria-label="Filtrar categoria" className="bg-card border border-border rounded-md p-2" value={category} onChange={e => setCategory(e.target.value)}>
    <option value="">Todas as categorias</option>{categories.map(c => <option key={c.id} value={c.id}>{c.payload.title}</option>)}</select>
    <select aria-label="Filtrar área" className="bg-card border border-border rounded-md p-2" value={area} onChange={e => setArea(e.target.value)}>
    <option value="">Todas as áreas</option>{areas.map(c => <option key={c.id} value={c.id}>{c.payload.title}</option>)}</select>
    </div>{loading ? <p role="status">Carregando catálogo...</p> : error ? <div role="alert">{error} <button className="underline" onClick={load}>Tentar novamente</button>
        </div> : <>
        <p className="text-sm text-muted-foreground" aria-live="polite">{filtered.length} projeto(s) encontrado(s)</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map(({ id, payload: p }) => {
                const wa = whatsappLink(settings, `Olá! Gostei do projeto "${p.title}" (${p.url}) e quero um site nesse estilo.`);
                return <article key={id} className="card-tech rounded-lg overflow-hidden flex flex-col">
                <button className="text-left" onClick={() => setPreview(p)} aria-label={`Visualizar ${p.title}`}>
                <div className="aspect-video bg-muted">{safeUrl(p.image_url) ? <img src={safeUrl(p.image_url)} alt={p.title} loading="lazy" className="w-full h-full object-cover object-top" onError={e => { e.currentTarget.src = "/placeholder.svg"; e.currentTarget.onerror = null; }}/> : <div className="p-8 text-muted-foreground">Prévia do projeto</div>}</div>
                <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">{categories.filter(c => p.categories?.includes(c.id)).map(c => <span key={c.id} className="text-xs bg-primary/10 text-primary rounded px-2 py-1">{c.payload.title}</span>)}</div>
                <span className="block mt-3 text-primary text-sm">Visualizar projeto →</span>
                </div>
                </button>{wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="m-4 mt-auto bg-accent text-accent-foreground p-2 rounded-lg text-center text-sm font-semibold">Quero um assim</a>}</article>;
            })}</div>{!filtered.length && <p>Nenhum projeto encontrado. Ajuste a busca ou os filtros.</p>}</>}<ProjectPreview project={preview} settings={settings} onClose={() => setPreview(null)}/>
    </div>;
}
