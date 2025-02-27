
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Edge Function: Starting request handling");
    
    const apiKey = Deno.env.get('IDEOGRAM_API_KEY');
    console.log("Edge Function: API key present:", !!apiKey);
    
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    const requestBody = {
      prompt: "Cute doggy",
      image_resolution: "RESOLUTION_1024_1024",
      style: "auto",
      visibility: "private",
      magic_prompt: true,
      rendering: "quality",
      num_images: 1
    };

    console.log("Edge Function: Request body:", requestBody);
    console.log("Edge Function: About to make Ideogram API call...");

    const response = await fetch('https://api.ideogram.ai/api/v1/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log("Edge Function: Ideogram API response status:", response.status);
    
    const responseText = await response.text();
    console.log("Edge Function: Raw Ideogram API response:", responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log("Edge Function: Parsed response data:", data);
      
      if (!response.ok) {
        throw new Error(`Ideogram API error (${response.status}): ${data.message || responseText}`);
      }

      if (!data.image_url) {
        throw new Error('No image URL in Ideogram API response');
      }

      return new Response(JSON.stringify({ image_url: data.image_url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (parseError) {
      console.error("Edge Function: JSON parse error:", parseError);
      throw new Error(`Failed to parse Ideogram API response: ${responseText}`);
    }
  } catch (error) {
    console.error("Edge Function Error:", error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Failed to generate image with Ideogram API"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
