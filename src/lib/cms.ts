import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
export const db = supabase as SupabaseClient;
export type Resource = "projects" | "categories" | "areas" | "plans" | "faq" | "content" | "settings" | "media";
export interface Payload {
    title: string;
    description?: string;
    url?: string;
    image_url?: string;
    categories?: string[];
    areas?: string[];
    price?: number;
    requests?: number;
    installments?: number;
    features?: string;
    whatsapp?: string;
    cnpj?: string;
    payment_url?: string;
    pix?: string;
    [key: string]: unknown;
}
export interface Entry {
    id: string;
    resource: Resource;
    draft: Payload;
    published: Payload | null;
    archived: boolean;
    updated_at: string;
    published_at: string | null;
}
export interface PublicEntry {
    id: string;
    resource: Resource;
    payload: Payload;
}
export async function publicEntries(): Promise<PublicEntry[]> {
    const result: PublicEntry[] = [];
    const batchSize = 500;
    for (let offset = 0;; offset += batchSize) {
        const { data, error } = await db.from("cms_public").select("*").order("position").order("id").range(offset, offset + batchSize - 1);
        if (error)
            throw error;
        result.push(...(data || []));
        if (!data || data.length < batchSize)
            return result;
    }
}
export function safeUrl(value?: string) { try {
    const u = new URL(value || "");
    return ["https:", "http:"].includes(u.protocol) && !u.username && !u.password ? u.href : "";
}
catch {
    return "";
} }
export function whatsappLink(settings: Payload | undefined, message: string) { const number = String(settings?.whatsapp || "").replace(/\D/g, ""); return number.length >= 10 && number.length <= 15 ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : ""; }
export const money = (value: unknown) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
