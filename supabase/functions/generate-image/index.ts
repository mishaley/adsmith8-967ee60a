
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
    if (!apiKey) {
      throw new Error('IDEOGRAM_API_KEY environment variable is not set');
    }

    // Clean up the API key - remove any "Bearer " prefix if present
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
    
    // If test parameter is present, just verify the API key
    const url = new URL(req.url);
    if (url.searchParams.get('test') === 'true') {
      // Make a test request to Ideogram API
      const testResponse = await fetch('https://api.ideogram.ai/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanApiKey}`
        }
      });

      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        throw new Error(`API Key validation failed: ${testResponse.status} - ${errorText}`);
      }

      const userData = await testResponse.json();
      return new Response(
        JSON.stringify({ 
          status: 'API Key is valid',
          user: userData
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Regular image generation logic continues below
    let prompt = "Cute doggy";
    try {
      const body = await req.json();
      if (body.prompt) {
        prompt = body.prompt;
      }
    } catch (e) {
      console.log("No body provided, using default prompt");
    }

    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ideogram API error status:", response.status);
      console.error("Ideogram API error response:", errorText);
      throw new Error(`Ideogram API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const image_url = data.url || data.data?.[0]?.url;
    if (!image_url) {
      throw new Error('No image URL in response');
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
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
