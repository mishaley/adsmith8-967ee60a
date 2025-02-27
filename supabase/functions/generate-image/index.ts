
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
    // Log key details without revealing the full key
    const keyInfo = {
      length: apiKey ? apiKey.length : 0,
      startsWithBearer: apiKey?.startsWith('Bearer ') || false,
      containsNewlines: apiKey?.includes('\n') || false,
      containsSpaces: apiKey?.includes(' ') || false,
      firstFewChars: apiKey ? `${apiKey.substring(0, 4)}...` : 'none'
    };
    console.log("API Key diagnostics:", keyInfo);
    
    if (!apiKey) {
      throw new Error('IDEOGRAM_API_KEY environment variable is not set');
    }

    // Clean up the API key - remove any "Bearer " prefix if present
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
    
    let prompt = "Cute doggy";
    try {
      const body = await req.json();
      if (body.prompt) {
        prompt = body.prompt;
      }
    } catch (e) {
      console.log("No body provided, using default prompt");
    }

    console.log("Making request to Ideogram API with prompt:", prompt);
    
    const headers = {
      'Authorization': `Bearer ${cleanApiKey}`,
      'Content-Type': 'application/json',
    };

    console.log("Request headers structure:", Object.keys(headers));

    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ideogram API error status:", response.status);
      console.error("Ideogram API error headers:", Object.fromEntries(response.headers.entries()));
      console.error("Ideogram API error response:", errorText);
      throw new Error(`Ideogram API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Successful response received");

    const image_url = data.url || data.data?.[0]?.url;
    if (!image_url) {
      console.error("No image URL in response:", data);
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
      JSON.stringify({ 
        error: error.message,
        details: "API Key format check:\n1. Make sure the API key doesn't include 'Bearer '\n2. Remove any spaces or newlines\n3. Verify it's a valid Ideogram API key"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
