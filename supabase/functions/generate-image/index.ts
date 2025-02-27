
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('IDEOGRAM_API_KEY');
    console.log("Checking API key:", apiKey ? "API key found" : "API key missing");
    
    if (!apiKey) {
      throw new Error('IDEOGRAM_API_KEY environment variable is not set');
    }

    let prompt = "Cute doggy";
    try {
      const body = await req.json();
      if (body.prompt) {
        prompt = body.prompt;
      }
    } catch (e) {
      console.log("No body provided, using default prompt");
    }

    console.log("Making request to Ideogram API");
    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ideogram API error response:", errorText);
      throw new Error(`Ideogram API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Successful response from Ideogram API:", JSON.stringify(data));

    const image_url = data.url || data.data?.[0]?.url;
    if (!image_url) {
      console.error("No image URL in Ideogram response:", data);
      throw new Error('No image URL in Ideogram response');
    }

    return new Response(
      JSON.stringify({ image_url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error("Edge function error:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "If you're seeing an unauthorized error, please verify the IDEOGRAM_API_KEY is properly set in Supabase Edge Function Secrets"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
