import { useState } from "react";
import { safeUrl } from "@/lib/cms";
function ThumbnailImage({ src, title }: { src: string; title: string }) {
 const [failed, setFailed] = useState(false);
 if (!src || failed) return <div className="aspect-video rounded-lg bg-muted border border-border flex items-center justify-center text-sm text-muted-foreground px-4 text-center">Prévia indisponível. Você pode enviar ou capturar uma imagem na edição.</div>;
 return <img src={src} alt={`Prévia de ${title}`} loading="lazy" referrerPolicy="no-referrer" className="w-full aspect-video object-cover object-top rounded-lg border border-border bg-muted" onError={() => setFailed(true)}/>;
}
export default function ProjectThumbnail({ title, imageUrl, siteUrl }: { title: string; imageUrl?: string; siteUrl?: string }) {
 const image = safeUrl(imageUrl);
 const url = safeUrl(siteUrl);
 const src = image || (url ? `https://image.thum.io/get/width/640/crop/360/noanimate/${url}` : "");
 return <div className="max-w-sm"><ThumbnailImage key={src} src={src} title={title}/></div>;
}
