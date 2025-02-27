
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
    const apiKey = Deno.env.get('IDEOGRAM_API_KEY');
    console.log("Starting API call with key present:", !!apiKey);
    
    if (!apiKey) {
      throw new Error('Ideogram API key not found in environment');
    }

    const response = await fetch('https://api.ideogram.ai/api/v1/text2image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: "A cute doggy",
        style: "photo"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Response received:", JSON.stringify(data));

    // Extract the image URL from the Ideogram response
    const image_url = data.output?.[0]?.image_url;
    if (!image_url) {
      console.error("No image URL in response data:", data);
      throw new Error('No image URL in Ideogram response');
    }

    return new Response(JSON.stringify({ image_url }), {
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
