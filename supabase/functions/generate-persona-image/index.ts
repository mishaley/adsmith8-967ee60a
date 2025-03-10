
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const IDEOGRAM_API_KEY = Deno.env.get('IDEOGRAM_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { prompt } = await req.json();
    console.log('Received portrait generation request with prompt:', prompt);

    if (!IDEOGRAM_API_KEY) {
      console.error('IDEOGRAM_API_KEY is not configured');
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

    if (!prompt) {
      console.error('No prompt provided');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No prompt provided' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log('Calling Ideogram API...');
    const response = await fetch('https://api.ideogram.ai/api/v1/images/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${IDEOGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        style: "photograph",
        width: 512,
        height: 512,
        steps: 50,
        seed: Math.floor(Math.random() * 1000000),
        numberOfImages: 1,
        modelVersion: "2.0",
        promptStrength: 7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ideogram API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Ideogram API error: ${response.status}`, 
          details: errorText 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status 
        }
      );
    }

    const data = await response.json();
    console.log('Successfully generated image');

    if (!data || !data.images || !data.images[0] || !data.images[0].url) {
      console.error('Invalid response format from Ideogram:', data);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid response format from Ideogram' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: data.images[0].url 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in generate-persona-image function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
