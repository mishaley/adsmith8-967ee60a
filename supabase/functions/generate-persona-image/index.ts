
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
    // Log the request
    console.log('Received request for image generation');
    
    // Parse request body
    const { prompt, resolution = 'RESOLUTION_1024_1024' } = await req.json();
    
    if (!prompt) {
      console.error('Error: No prompt provided');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No prompt provided' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log(`Processing image generation with prompt: ${prompt}`);
    console.log(`Using resolution: ${resolution}`);
    
    if (!IDEOGRAM_API_KEY) {
      console.error('Error: IDEOGRAM_API_KEY not set in environment');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'API key not configured', 
          details: 'The Ideogram API key is not set in the environment variables' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call the Ideogram API to generate an image
    const response = await fetch('https://api.ideogram.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${IDEOGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        resolution,
        style: "DEFAULT", // Default style or can be passed from request
      }),
    });

    const data = await response.json();
    console.log('Ideogram API response:', JSON.stringify(data));
    
    if (!response.ok) {
      console.error(`Error from Ideogram API: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Ideogram API error: ${response.status} ${response.statusText}`, 
          details: data 
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract the image URL from the API response
    if (data && data.data && data.data.length > 0 && data.data[0].url) {
      const imageUrl = data.data[0].url;
      console.log(`Image generated successfully: ${imageUrl}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      console.error('Error: Invalid response format from Ideogram API');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid response format from Ideogram API', 
          details: data 
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error in generate-persona-image function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error', 
        stack: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
