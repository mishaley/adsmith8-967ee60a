
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
      return new Response(
        JSON.stringify({ error: 'IDEOGRAM_API_KEY environment variable is not set' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Clean up the API key - remove any "Bearer " prefix if present
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
    
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    // If test parameter is present in the body, just verify the API key
    if (body.test === true) {
      try {
        const testResponse = await fetch('https://api.ideogram.ai/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${cleanApiKey}`
          }
        });

        const userData = await testResponse.json();
        
        if (!testResponse.ok) {
          return new Response(
            JSON.stringify({ error: 'Invalid API key' }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 401
            }
          );
        }

        return new Response(
          JSON.stringify({ 
            status: 'API Key is valid',
            user: userData
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to validate API key' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }
    }

    // Regular image generation logic
    const prompt = body.prompt || "Cute doggy";
    
    try {
      const response = await fetch('https://api.ideogram.ai/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to generate image' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status
          }
        );
      }

      const image_url = data.url || data.data?.[0]?.url;
      if (!image_url) {
        return new Response(
          JSON.stringify({ error: 'No image URL in response' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }

      return new Response(
        JSON.stringify({ image_url }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate image' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
