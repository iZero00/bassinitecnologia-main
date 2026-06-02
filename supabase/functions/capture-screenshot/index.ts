import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, site_id } = await req.json();

    if (!url || !site_id) {
      return new Response(
        JSON.stringify({ success: false, error: "url and site_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use a free screenshot API
    const screenshotUrl = `https://image.thum.io/get/width/1280/crop/720/noanimate/${url}`;

    console.log("Capturing screenshot for:", url);

    const imgResponse = await fetch(screenshotUrl);
    if (!imgResponse.ok) {
      throw new Error(`Screenshot service returned ${imgResponse.status}`);
    }

    const imgBuffer = await imgResponse.arrayBuffer();
    const imgUint8 = new Uint8Array(imgBuffer);

    // Upload to Supabase Storage
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const fileName = `auto/${site_id}.png`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("site-screenshots")
      .upload(fileName, imgUint8, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("site-screenshots")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // Update the portfolio_sites record
    const { error: updateError } = await supabaseAdmin
      .from("portfolio_sites")
      .update({ image_url: publicUrl })
      .eq("id", site_id);

    if (updateError) {
      console.error("DB update error:", updateError);
    }

    console.log("Screenshot captured and saved:", publicUrl);

    return new Response(
      JSON.stringify({ success: true, image_url: publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Failed to capture screenshot" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
