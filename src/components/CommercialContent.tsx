import { usePublicContent } from "@/hooks/use-public-content";
import { money, safeUrl, whatsappLink, type PublicEntry } from "@/lib/cms";
export default function CommercialContent({ entries }: {
    entries?: PublicEntry[];
} = {}) {
    const query = usePublicContent();
    const rows = entries || query.rows;
    const settings = rows.find(r => r.resource === "settings")?.payload;
    const { refetch } = query;
    const isPending = !entries && query.isPending;
    const isError = !entries && query.isError;
    return <section id="planos" className="relative max-w-6xl mx-auto py-16 px-4 space-y-10">
    <h2 className="text-center text-3xl font-bold">Planos para seu <span className="text-gradient">negócio</span>
    </h2>{isPending ? <p role="status">Carregando planos...</p> : isError ? <p role="alert">Planos indisponíveis. <button className="underline" onClick={() => void refetch()}>Tentar novamente</button>
        </p> : null}<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{rows.filter(r => r.resource === "plans").map(({ id, payload: p }) => {
            const wa = whatsappLink(settings, `Olá! Quero saber mais sobre o plano ${p.title}, de ${money(p.price)}.`);
            return <article key={id} className="card-tech rounded-xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-xl">{p.title}</h3>
            <strong className="text-3xl text-gradient">{money(p.price)}</strong>
            <p className="text-sm">{Number(p.installments) > 1 ? `Até ${Math.min(6, Number(p.installments))}x sem juros no link InfinitePay` : "Pagamento à vista via Pix ou link InfinitePay"}</p>
            <p className="text-sm text-muted-foreground">{p.description}</p>
            <ul className="text-sm space-y-2 flex-1">{String(p.features || "").split("\n").filter(Boolean).map((f, i) => <li key={i}>✓ {f}</li>)}</ul>{wa && <a className="bg-accent text-accent-foreground rounded-lg p-3 text-center" href={wa} target="_blank" rel="noopener noreferrer">Quero esse plano</a>}{safeUrl(p.payment_url) && <a className="underline text-sm" href={safeUrl(p.payment_url)} target="_blank" rel="noopener noreferrer">Pagar pelo link InfinitePay</a>}</article>;
        })}</div>
    <div className="grid md:grid-cols-2 gap-6">{rows.filter(r => r.resource === "content").map(({ id, payload: p }) => <article key={id} className="card-tech rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
        <p className="whitespace-pre-wrap text-muted-foreground">{p.description}</p>
        </article>)}</div>
    <div className="max-w-3xl mx-auto space-y-3">
    <h2 className="text-2xl font-bold mb-6">Perguntas frequentes</h2>{rows.filter(r => r.resource === "faq").map(({ id, payload: p }) => <details key={id} className="card-tech p-4 rounded-lg">
        <summary className="font-semibold cursor-pointer">{p.title}</summary>
        <p className="pt-3 whitespace-pre-wrap text-muted-foreground">{p.description}</p>
        </details>)}</div>{rows.some(r => r.resource === "media") && <div className="grid sm:grid-cols-3 gap-4">{rows.filter(r => r.resource === "media").map(({ id, payload: p }) => <figure key={id}>{safeUrl(p.image_url) && <img className="rounded-lg w-full object-contain max-h-64" loading="lazy" src={safeUrl(p.image_url)} alt={p.title}/>}<figcaption>{p.title}</figcaption>
            </figure>)}</div>}<div className="text-center text-sm text-muted-foreground space-y-2">{settings?.cnpj && <p>CNPJ: {settings.cnpj}</p>}{settings?.pix && <p>Pix: {settings.pix}</p>}{safeUrl(settings?.payment_url) && <p>
        <a className="underline" href={safeUrl(settings?.payment_url)} target="_blank" rel="noopener noreferrer">Link de pagamento InfinitePay</a>
        </p>}{safeUrl(String(settings?.instagram || "")) && <a className="underline" href={safeUrl(String(settings?.instagram))} target="_blank" rel="noopener noreferrer">Instagram</a>}</div>
    </section>;
}
