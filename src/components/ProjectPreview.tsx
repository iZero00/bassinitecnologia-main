import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { safeUrl, whatsappLink, type Payload } from "@/lib/cms";
export default function ProjectPreview({ project, settings, onClose }: {
    project: Payload | null;
    settings?: Payload;
    onClose: () => void;
}) {
    const [mobile, setMobile] = useState(false);
    const [imageOnly, setImageOnly] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);
    const url = safeUrl(project?.url);
    const image = safeUrl(project?.image_url);
    const wa = whatsappLink(settings, `Olá! Gostei do projeto "${project?.title}" (${url}) no catálogo da Bassini Tecnologia. Quero um orçamento nesse estilo.`);
    return <Dialog open={!!project} onOpenChange={open => { if (!open) {
        onClose();
        setImageOnly(false);
        setImageFailed(false);
    } }}>
    <DialogContent className="max-w-6xl w-[96vw] max-h-[94dvh] overflow-y-auto p-4">
    <DialogHeader>
    <DialogTitle>{project?.title}</DialogTitle>
    <DialogDescription>{project?.description || "Prévia do projeto"}</DialogDescription>
    </DialogHeader>
    <div className="flex flex-wrap gap-2">
    <Button variant="outline" onClick={() => setMobile(!mobile)}>{mobile ? "Visualizar desktop" : "Visualizar celular"}</Button>
    <Button variant="outline" onClick={() => setImageOnly(!imageOnly)}>{imageOnly ? "Tentar prévia interativa" : "Prévia bloqueada? Ver imagem"}</Button>{url && <a className="underline p-2" href={url} target="_blank" rel="noopener noreferrer">Abrir site em nova aba</a>}</div>
    <p className="text-xs text-muted-foreground">Alguns sites impedem a exibição incorporada. Use a imagem ou abra o site em outra aba.</p>
    <div className="bg-muted rounded-lg overflow-hidden mx-auto w-full" style={{ maxWidth: mobile ? 390 : undefined }}>{imageOnly ? (image && !imageFailed ? <img src={image} alt={project?.title} className="w-full" onError={() => setImageFailed(true)}/> : <p className="p-8">Imagem indisponível. Abra o site em outra aba.</p>) : url ? <iframe title={`Prévia de ${project?.title}`} src={url} className="w-full h-[55dvh] md:h-[60dvh] border-0" sandbox="allow-scripts allow-same-origin allow-forms" referrerPolicy="no-referrer" onError={() => setImageOnly(true)}/> : <p className="p-8">URL indisponível.</p>}</div>{wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="bg-accent text-accent-foreground rounded-lg p-3 text-center font-semibold">Quero um projeto assim</a> : <p>Configure o WhatsApp no painel para receber pedidos.</p>}</DialogContent>
    </Dialog>;
}
