import { createClient } from "npm:@supabase/supabase-js@2";
export const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
export function response(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});}
export async function staff(req:Request){
 const token=req.headers.get("Authorization")?.replace(/^Bearer /i,"");if(!token)throw new Error("Acesso negado");
 const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
 const {data:{user},error}=await admin.auth.getUser(token);if(error||!user)throw new Error("Acesso negado");
 const {data}=await admin.from("cms_members").select("role").eq("user_id",user.id).maybeSingle();if(!data)throw new Error("Acesso negado");
 return {admin,user};
}
export function publicUrl(raw:unknown){const url=new URL(String(raw));if(!["https:","http:"].includes(url.protocol)||url.username||url.password||url.port&&!['80','443'].includes(url.port))throw new Error("URL inválida");const host=url.hostname.toLowerCase();if(!host.includes(".")||host.endsWith(".local")||host.endsWith(".localhost")||host.endsWith(".internal")||/^[\d.]+$/.test(host)||host.includes(":"))throw new Error("Use um domínio público");return url;}
