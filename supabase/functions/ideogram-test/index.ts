
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

    let prompt = 'A serene tropical beach scene with palm trees and blue water';
    
    // If there's a body with a prompt, use that
    if (req.method === 'POST') {
      try {
        const requestData = await req.json();
        if (requestData.prompt) {
          prompt = requestData.prompt;
        }
      } catch (err) {
        // If JSON parsing fails, proceed with default prompt
        console.log('Could not parse request body, using default prompt');
      }
    }

    console.log('Generating image with prompt:', prompt);

    // Fixed URL to the correct endpoint
    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_request: {
          prompt,
          aspect_ratio: "ASPECT_1_1", // Square image by default
          model: "V_2", // Using default model V_2
          magic_prompt_option: "AUTO"
        }
      }),
    });

    const data = await response.json();
    console.log('Ideogram API response status:', response.status);
    
    if (response.ok) {
      // Extract the image URL from the API response
      let imageUrl = null;
      if (data && data.data && data.data.length > 0 && data.data[0].url) {
        imageUrl = data.data[0].url;
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data.data || [],
          imageUrl
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
