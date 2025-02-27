
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('MODELSLAB_API_KEY');
    console.log("1. Starting API call with key present:", !!apiKey);
    
    if (!apiKey) {
      throw new Error('ModelsLab API key not found in environment');
    }

    const { prompt } = await req.json();
    console.log("2. Received prompt:", prompt);

    console.log("3. Making request to ModelsLab API...");
    const response = await fetch('https://api.modelslab.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt || "A cute doggy",
        n: 1,
        model: "dalle-3",
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      })
    });

    const responseData = await response.json();
    console.log("4. Response status:", response.status);
    console.log("5. Response data:", JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(`ModelsLab API error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    if (!responseData.data?.[0]?.url) {
      throw new Error('No image URL in ModelsLab API response');
    }

    // ModelsLab returns an array of image URLs
    const image_url = responseData.data[0].url;

    return new Response(JSON.stringify({ 
      image_url,
      status: response.status,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      status: 500
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
