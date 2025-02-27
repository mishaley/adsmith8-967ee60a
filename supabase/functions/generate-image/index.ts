
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('IDEOGRAM_API_KEY');
    console.log("1. Starting API call with key present:", !!apiKey);
    
    if (!apiKey) {
      throw new Error('Ideogram API key not found in environment');
    }

    console.log("2. Making request to Ideogram API...");
    const response = await fetch('https://api.ideogram.ai/api/v1/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: "test",
        num_images: 1
      })
    });

    console.log("3. Response status:", response.status);
    const text = await response.text();
    console.log("4. Response body:", text);

    return new Response(JSON.stringify({ 
      status: response.status,
      response: text 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: response.ok ? 200 : 500
    });

  } catch (error) {
    console.error("5. Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
