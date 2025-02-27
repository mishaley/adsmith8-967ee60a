
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

    // Parse the request body for the prompt
    const { prompt } = await req.json();
    console.log("2. Received prompt:", prompt);

    console.log("3. Making request to Ideogram API...");
    const response = await fetch('https://api.ideogram.ai/api/v1/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt || "A cute doggy",
        style: "photo",
        width: 1024,
        height: 1024,
        steps: 30,
        cfg_scale: 7.5,
        num_images: 1,
        seed: Math.floor(Math.random() * 1000000)
      })
    });

    console.log("4. Response status:", response.status);
    const responseData = await response.json();
    console.log("5. Response data:", responseData);

    if (!response.ok) {
      throw new Error(`Ideogram API error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    return new Response(JSON.stringify({ 
      image_url: responseData.image_url,
      status: response.status,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
