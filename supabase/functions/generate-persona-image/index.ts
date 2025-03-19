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
    const requestData = await req.json();
    const { name, gender, age, ageMin, ageMax, race, customPrompt } = requestData;
    
    // Build the prompt based on provided data or use customPrompt
    let prompt;
    
    if (customPrompt) {
      prompt = customPrompt;
      console.log(`Using custom prompt: ${prompt}`);
    } else {
      // Construct a default prompt based on persona attributes
      const ageRange = ageMin && ageMax ? `${ageMin}-${ageMax}` : age || "25-45";
      prompt = `Portrait photograph, ${race || "diverse"} ${gender || "person"}, age ${ageRange}, studio lighting, neutral background, professional quality, photorealistic, high resolution`;
      console.log(`Using generated prompt: ${prompt}`);
    }
    
    // Validate API key
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
    console.log('Calling Ideogram API...');
    const response = await fetch('https://api.ideogram.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${IDEOGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        resolution: "RESOLUTION_1024_1024",
        style: "DEFAULT",
      }),
    });

    // Log the raw response status for debugging
    console.log('Ideogram API response status:', response.status);
    console.log('Ideogram API response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Ideogram API response data (preview):', JSON.stringify(data).substring(0, 200) + '...');
    
    if (!response.ok) {
      console.error(`Error from Ideogram API: ${response.status} ${response.statusText}`);
      console.error('Response data:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Ideogram API error: ${response.status} ${response.statusText}`, 
          details: data 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 502 
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
          image_url: imageUrl 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      console.error('Error: Invalid response format from Ideogram API');
      console.error('Response data:', JSON.stringify(data));
      
      // More detailed error for empty results
      if (data && data.data && data.data.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Ideogram API returned empty results', 
            details: data 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 502 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid response format from Ideogram API', 
          details: data 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 502 
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