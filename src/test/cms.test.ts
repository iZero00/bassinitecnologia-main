import { describe, it, expect, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
import { safeUrl, whatsappLink, money } from "@/lib/cms";
describe("links públicos", () => { it("rejeita protocolos executáveis e credenciais em URLs", () => { for (const value of ["javascript:alert(1)", "data:text/html,hello", "https://user:pass@example.com", "//example.com", ""])
    expect(safeUrl(value)).toBe(""); expect(safeUrl("https://example.com")).toBe("https://example.com/"); }); it("não inventa WhatsApp e codifica contexto", () => { expect(whatsappLink(undefined, "Oi")).toBe(""); expect(whatsappLink({ title: "x", whatsapp: "123" }, "Oi")).toBe(""); expect(decodeURIComponent(whatsappLink({ title: "x", whatsapp: "55 (67) 99307-3133" }, "Pneus & serviços"))).toBe("https://wa.me/5567993073133?text=Pneus & serviços"); }); it("formata preços brasileiros", () => expect(money(1497)).toMatch(/1\.497,00/)); });
