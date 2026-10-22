import { cors,response,staff,publicUrl } from "../_shared/security.ts";
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response(null,{headers:cors});
 if(req.method!=="POST")return response({success:false,error:"Método não permitido"},405);
 try{
  const {admin,user}=await staff(req);const body=await req.json();const url=publicUrl(body.url);
  // This operation only creates an image. It cannot update or publish any entry.
  const result=await fetch(`https://image.thum.io/get/width/1280/crop/720/noanimate/${url.href}`,{signal:AbortSignal.timeout(20000)});
  if(!result.ok)throw new Error("Captura indisponível. Use upload.");
  const type=result.headers.get("content-type")?.split(";")[0]||"";if(!["image/png","image/jpeg","image/webp"].includes(type))throw new Error("Resposta de imagem inválida");
  if(Number(result.headers.get("content-length"))>5242880)throw new Error("Imagem excede 5 MB");
  const reader=result.body?.getReader();if(!reader)throw new Error("Imagem vazia");const chunks:Uint8Array[]=[];let size=0;
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>5242880){await reader.cancel();throw new Error("Imagem excede 5 MB");}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  const path=`${user.id}/${crypto.randomUUID()}.${type.split("/")[1]}`;
  const {error}=await admin.storage.from("site-screenshots").upload(path,bytes,{contentType:type});if(error)throw error;
  return response({success:true,image_url:admin.storage.from("site-screenshots").getPublicUrl(path).data.publicUrl});
 }catch(error){const denied=error instanceof Error&&error.message==="Acesso negado";return response({success:false,error:denied?"Acesso negado":"Não foi possível capturar a imagem. Confira a URL ou use upload."},denied?403:400);}
});
