
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const apiKey = Deno.env.get('IDEOGRAM_API_KEY');
    
    if (!apiKey) {
      console.error('IDEOGRAM_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'API key not configured' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const requestData = await req.json();
    const prompt = requestData.prompt || 'portrait of a person, magazine style, professional photograph';

    console.log('Generating image with prompt:', prompt);

    const response = await fetch('https://api.ideogram.ai/api/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        style: 'photograph',
        width: 512,
        height: 512,
        steps: 30
      }),
    });

    const data = await response.json();
    console.log('Ideogram API response status:', response.status);
    
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data.images || [],
          imageUrl: data.images && data.images.length > 0 ? data.images[0].url : null
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      console.error('Error response from Ideogram API:', data);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: data.message || 'Unknown error from Ideogram API',
          details: data
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status
        }
      );
    }
  } catch (error) {
    console.error('Error in ideogram-test function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
