
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
    console.log('Starting image generation request');
    const requestData = await req.json();
    console.log('Request data:', requestData);
    
    const { message_id, image_format, image_resolution, image_style, image_model, image_inputprompt } = requestData;
    
    // Input validation with detailed logging
    if (!message_id || !image_format || !image_resolution || !image_inputprompt) {
      const missingFields = [];
      if (!message_id) missingFields.push('message_id');
      if (!image_format) missingFields.push('image_format');
      if (!image_resolution) missingFields.push('image_resolution');
      if (!image_inputprompt) missingFields.push('image_inputprompt');
      
      console.error('Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          details: `Missing: ${missingFields.join(', ')}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('All required fields present, calling Ideogram API');
    console.log('IDEOGRAM_API_KEY present:', !!Deno.env.get('IDEOGRAM_API_KEY'));

    // Test Ideogram API call
    const ideogramResponse = await fetch('https://api.ideogram.ai/api/v1/images/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('IDEOGRAM_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: image_inputprompt,
        resolution: 'RESOLUTION_1024_1024',
        style: image_style || 'auto',
        visibility: 'private',
        magic_prompt: 'on',
        rendering: 'quality',
        num_images: 1 // Start with just 1 image for testing
      })
    });

    console.log('Ideogram API response status:', ideogramResponse.status);
    
    if (!ideogramResponse.ok) {
      const errorText = await ideogramResponse.text();
      console.error('Ideogram API error response:', errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Ideogram API error',
          status: ideogramResponse.status,
          details: errorText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: ideogramResponse.status }
      );
    }

    const ideogramData = await ideogramResponse.json();
    console.log('Ideogram API response data:', JSON.stringify(ideogramData, null, 2));

    return new Response(
      JSON.stringify({ 
        success: true,
        images: ideogramData.images.map((img: any) => ({ image_storage: img.url }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message,
        stack: error.stack
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
