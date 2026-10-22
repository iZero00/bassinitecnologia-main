import CommercialContent from "@/components/CommercialContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { db, safeUrl, type Entry, type Resource, type Payload } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProjectPreview from "@/components/ProjectPreview";
import { useNavigate } from "react-router-dom";
const modules: Record<Resource, string> = { projects: "Projetos", categories: "Categorias", areas: "Áreas", plans: "Preços e planos", faq: "FAQ", content: "Conteúdo comercial", settings: "Configurações", media: "Mídias" };
type History = {
    id: number;
    action: string;
    created_at: string;
    snapshot: unknown;
};
export default function Admin() {
    const navigate = useNavigate();
    const [role, setRole] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);
    const [rows, setRows] = useState<Entry[]>([]);
    const [kind, setKind] = useState<Resource>("projects");
    const [editing, setEditing] = useState<Entry | null>(null);
    const [body, setBody] = useState<Payload>({ title: "" });
    const [selected, setSelected] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const [preview, setPreview] = useState<Payload | null>(null);
    const [history, setHistory] = useState<History[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [commercialPreview, setCommercialPreview] = useState(false);
    const reload = async () => { const { data, error } = await db.from("cms_entries").select("*").order("position").order("updated_at", { ascending: false }); if (error)
        throw error; setRows(data || []); };
    useEffect(() => { document.title = "Admin | Bassini Tecnologia"; let active = true; const init = async () => { try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            navigate("/auth");
            return;
        }
        const { data, error } = await db.from("cms_members").select("role").eq("user_id", user.id).maybeSingle();
        if (error)
            throw error;
        if (active) {
            setRole(data?.role || null);
            if (data)
                await reload();
        }
    }
    catch {
        if (active)
            setMessage("Não foi possível verificar as permissões. Confira a configuração e a migração do banco.");
    }
    finally {
        if (active)
            setChecked(true);
    } }; void init(); const { data: { subscription } } = supabase.auth.onAuthStateChange(event => { if (event === "SIGNED_OUT")
        navigate("/auth"); }); return () => { active = false; subscription.unsubscribe(); }; }, [navigate]);
    const run = async (work: () => Promise<void>) => { setBusy(true); setMessage(""); try {
        await work();
    }
    catch (error) {
        setMessage(error instanceof Error ? error.message : String((error as {
            message?: string;
        })?.message || error));
    }
    finally {
        setBusy(false);
    } };
    const reset = () => { setEditing(null); setBody({ title: "" }); setHistory([]); setShowHistory(false); };
    const edit = (entry: Entry) => { setEditing(entry); setBody(structuredClone(entry.draft)); setHistory([]); setShowHistory(false); };
    const set = (key: string, value: unknown) => setBody(prev => ({ ...prev, [key]: value }));
    const save = () => run(async () => { if (!body.title.trim())
        throw new Error("Informe um título."); for (const field of ["url", "image_url", "payment_url"]) {
        if (body[field] && !safeUrl(String(body[field])))
            throw new Error("Use URLs HTTP ou HTTPS válidas.");
    } if (kind === "projects" && !safeUrl(body.url))
        throw new Error("Informe a URL do projeto."); const { data, error } = await db.rpc("cms_save", { entry_id: editing?.id || null, kind, body, expected_updated: editing?.updated_at || null }); if (error)
        throw error; await reload(); const { data: entry } = await db.from("cms_entries").select("*").eq("id", data).single(); if (entry)
        edit(entry); setMessage("Rascunho salvo. Publique manualmente para atualizar o site."); });
    const transition = (operation: string, ids: string[]) => run(async () => { if (!ids.length)
        throw new Error("Selecione pelo menos um item salvo."); if (!window.confirm(`${operation === "publish" ? "Publicar" : operation === "delete" ? "Excluir definitivamente" : operation === "archive" ? "Arquivar" : operation === "restore" ? "Restaurar" : "Retirar do ar"} ${ids.length} item(ns)?`))
        return; const { error } = await db.rpc("cms_transition", { ids, operation }); if (error)
        throw error; await reload(); setSelected([]); reset(); setMessage("Operação concluída."); });
    const upload = (file: File | undefined) => { if (!file)
        return; void run(async () => { if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5242880)
        throw new Error("Use JPG, PNG ou WebP com até 5 MB."); const { data: { user } } = await supabase.auth.getUser(); if (!user)
        throw new Error("Entre novamente."); const path = `${user.id}/${crypto.randomUUID()}.${file.type.split("/")[1]}`; const { error } = await supabase.storage.from("site-screenshots").upload(path, file, { contentType: file.type }); if (error)
        throw error; set("image_url", supabase.storage.from("site-screenshots").getPublicUrl(path).data.publicUrl); setMessage("Imagem enviada. Salve o rascunho para associá-la ao item."); }); };
    const capture = () => run(async () => { if (!safeUrl(body.url))
        throw new Error("Informe uma URL válida."); const { data, error } = await supabase.functions.invoke("capture-screenshot", { body: { url: body.url } }); if (error || !data?.success)
        throw new Error(data?.error || error?.message || "Captura indisponível. Use o upload."); set("image_url", data.image_url); setMessage("Captura pronta. Salve o rascunho para mantê-la."); });
    const loadHistory = (id: string) => run(async () => { const { data, error } = await db.from("cms_history").select("id,action,created_at,snapshot").eq("entry_id", id).order("created_at", { ascending: false }).limit(30); if (error)
        throw error; setHistory(data || []); setShowHistory(true); });
    if (!checked)
        return <main className="p-8">Verificando acesso...</main>;
    if (!role)
        return <main className="p-8 space-y-4">
        <h1>Acesso não autorizado</h1>
        <p>{message || "Sua conta não possui permissão administrativa. O responsável deve atribuir uma função no banco."}</p>
        <Button onClick={() => supabase.auth.signOut()}>Sair</Button>
        </main>;
    const canPublish = role === "admin" || role === "publisher";
    const visible = rows.filter(r => r.resource === kind);
    const settings = rows.find(r => r.resource === "settings")?.draft;
    return <div className="min-h-screen bg-background">
    <header className="border-b p-4 flex flex-wrap justify-between gap-3">
    <h1 className="font-bold">Bassini Tecnologia · Administração</h1>
    <span>{role}</span>
    <a href="/" target="_blank" rel="noopener noreferrer" className="underline">Ver site</a>
    <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sair</Button>
    </header>
    <main className="max-w-6xl mx-auto p-4 space-y-6">
    <nav className="flex flex-wrap gap-2" aria-label="Módulos">{Object.entries(modules).filter(([key]) => key !== "settings" || role === "admin").map(([key, label]) => <Button key={key} variant={kind === key ? "default" : "outline"} disabled={busy} onClick={() => { setKind(key as Resource); setSelected([]); reset(); }}>{label}</Button>)}</nav>{message && <p role="status" className="border border-primary rounded p-3 whitespace-pre-wrap">{message}</p>}<div className="grid lg:grid-cols-2 gap-6">
    <section className="card-tech p-5 rounded-lg space-y-4">
    <h2 className="text-xl font-bold">{editing ? "Editar rascunho" : "Novo item"} · {modules[kind]}</h2>
    <p className="text-xs text-muted-foreground">Salvar mantém o rascunho privado. A publicação é uma ação separada. Imagens enviadas são arquivos públicos: não envie conteúdo confidencial.</p>
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); void save(); }}>
    <fieldset disabled={busy} className="space-y-4">
    <label className="block">Título<Input required maxLength={200} value={body.title} onChange={e => set("title", e.target.value)}/>
    </label>
    <label className="block">Descrição / resposta / texto<Textarea rows={5} value={String(body.description || "")} onChange={e => set("description", e.target.value)}/>
    </label>{["projects", "media"].includes(kind) && <>
        <label className="block">URL<Input type="url" required={kind === "projects"} value={String(body.url || "")} onChange={e => set("url", e.target.value)}/>
        </label>
        <label className="block">URL da imagem<Input type="url" value={String(body.image_url || "")} onChange={e => set("image_url", e.target.value)}/>
        </label>
        <label className="block">Enviar imagem (até 5 MB)<Input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => upload(e.target.files?.[0])}/>
        </label>{safeUrl(body.image_url) && <img className="max-h-40 rounded" src={safeUrl(body.image_url)} alt="Imagem do rascunho"/>}</>}{kind === "projects" && <>
        <Button type="button" variant="outline" onClick={() => void capture()}>Capturar imagem automaticamente (opcional)</Button>
        <p className="text-xs text-muted-foreground">A captura envia a URL ao serviço externo thum.io. Se indisponível, use upload.</p>{(["categories", "areas"] as const).map(resource => <fieldset key={resource} className="border rounded p-3">
            <legend>{modules[resource]} (múltiplas)</legend>{rows.filter(r => r.resource === resource && !r.archived).map(r => <label key={r.id} className="flex gap-2 p-1">
                <input type="checkbox" checked={(body[resource] || []).includes(r.id)} onChange={e => set(resource, e.target.checked ? [...(body[resource] || []), r.id] : (body[resource] || []).filter(id => id !== r.id))}/>{r.draft.title}{!r.published && " (rascunho)"}</label>)}</fieldset>)}<Button type="button" variant="outline" onClick={() => setPreview(body)}>Prévia do projeto</Button>
        </>}{kind === "plans" && <>
        <label className="block">Preço (R$)<Input type="number" min="0" step="0.01" value={Number(body.price || 0)} onChange={e => set("price", Number(e.target.value))}/>
        </label>
        <label className="block">Parcelas sem juros (1 a 6)<Input type="number" min="1" max="6" value={Number(body.installments || 1)} onChange={e => set("installments", Number(e.target.value))}/>
        </label>
        <label className="block">Recursos (um por linha)<Textarea value={String(body.features || "")} onChange={e => set("features", e.target.value)}/>
        </label>
        <label className="block">Link de pagamento InfinitePay (opcional)<Input type="url" value={String(body.payment_url || "")} onChange={e => set("payment_url", e.target.value)}/>
        </label>
        </>}{kind === "settings" && [["whatsapp", "WhatsApp com país e DDD"], ["cnpj", "CNPJ"], ["payment_url", "Link InfinitePay"], ["pix", "Chave Pix (será pública)"], ["email", "E-mail comercial"], ["instagram", "URL do Instagram"]].map(([key, label]) => <label className="block" key={key}>{label}<Input value={String(body[key] || "")} onChange={e => set(key, e.target.value)}/>
        </label>)}<div className="flex flex-wrap gap-2">{!["projects", "categories", "areas"].includes(kind) && <Button type="button" variant="outline" onClick={() => setCommercialPreview(true)}>Prévia do conteúdo</Button>}<Button type="submit">{busy ? "Aguarde..." : "Salvar rascunho"}</Button>
    <Button type="button" variant="outline" onClick={reset}>Novo / limpar</Button>
    </div>
    </fieldset>
    </form>{editing && canPublish && <div className="flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => void transition("publish", [editing.id])}>Publicar versão salva</Button>
        <Button disabled={busy} variant="outline" onClick={() => void transition("unpublish", [editing.id])}>Retirar do ar</Button>
        </div>}<p className="text-xs text-muted-foreground">Confira e salve suas alterações antes de publicar. Em conteúdo e FAQ, a edição acima permite conferir o texto completo.</p>
    </section>
    <section className="space-y-3">
    <div className="flex flex-wrap gap-2">
    <h2 className="font-bold flex-1">Itens ({visible.length})</h2>
    <Button variant="outline" disabled={busy} onClick={() => void run(reload)}>Recarregar</Button>
    </div>{canPublish && <div className="flex flex-wrap gap-2">
        <Button disabled={busy || !selected.length} onClick={() => void transition("publish", selected)}>Publicar selecionados ({selected.length})</Button>
        <Button variant="outline" disabled={busy || !selected.length} onClick={() => void transition("archive", selected)}>Arquivar selecionados</Button>
        </div>}{visible.map(entry => <article key={entry.id} className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-3">
        <input aria-label={`Selecionar ${entry.draft.title}`} type="checkbox" checked={selected.includes(entry.id)} onChange={e => setSelected(e.target.checked ? [...selected, entry.id] : selected.filter(id => id !== entry.id))}/>
        <h3 className="font-semibold">{entry.draft.title}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{entry.archived ? "Arquivado" : entry.published ? JSON.stringify(entry.draft) === JSON.stringify(entry.published) ? "Publicado" : "Publicado · alterações em rascunho" : "Rascunho"}</p>
        <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" disabled={busy} onClick={() => edit(entry)}>Editar / conferir</Button>
        <Button variant="outline" size="sm" disabled={busy} onClick={() => void loadHistory(entry.id)}>Histórico</Button>{canPublish && <Button size="sm" variant="outline" disabled={busy} onClick={() => void transition(entry.archived ? "restore" : "archive", [entry.id])}>{entry.archived ? "Restaurar" : "Arquivar"}</Button>}{role === "admin" && <Button size="sm" variant="destructive" disabled={busy} onClick={() => void transition("delete", [entry.id])}>Excluir</Button>}</div>
        </article>)}{showHistory && <section className="border rounded p-4">
        <h3 className="font-semibold">Histórico (últimas 30 ações)</h3>{!history.length && <p>Nenhum histórico disponível.</p>}{history.map(h => <details key={h.id}>
            <summary className="cursor-pointer py-2">{new Date(h.created_at).toLocaleString("pt-BR")} · {h.action}</summary>
            <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(h.snapshot, null, 2)}</pre>
            </details>)}</section>}</section>
    </div>
    <Dialog open={commercialPreview} onOpenChange={setCommercialPreview}>
    <DialogContent className="max-w-6xl w-[96vw] max-h-[90dvh] overflow-y-auto">
    <DialogHeader>
    <DialogTitle>Prévia privada · conteúdo ainda não publicado</DialogTitle>
    <DialogDescription>Confira a versão em edição. Fechar esta janela não publica nem salva alterações.</DialogDescription>
    </DialogHeader>
    <CommercialContent entries={[...rows.filter(r => r.id !== editing?.id && r.published && !r.archived).map(r => ({ id: r.id, resource: r.resource, payload: r.published! })), { id: editing?.id || "preview", resource: kind, payload: body }]}/>
    </DialogContent>
    </Dialog>
    <ProjectPreview project={preview} settings={settings} onClose={() => setPreview(null)}/>
    </main>
    </div>;
}
