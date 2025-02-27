
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
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
    const { message_id, image_format, image_resolution, image_style, image_model, image_inputprompt } = await req.json();
    console.log('Received request with params:', { message_id, image_format, image_resolution, image_style, image_model, image_inputprompt });

    // Input validation
    if (!message_id || !image_format || !image_resolution || !image_inputprompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Just test the Ideogram API first
    console.log('Calling Ideogram API with prompt:', image_inputprompt);
    const ideogramResponse = await fetch('https://api.ideogram.ai/api/v1/images/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('IDEOGRAM_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: image_inputprompt,
        resolution: 'RESOLUTION_1024_1024', // Let's use a fixed resolution for testing
        style: image_style || 'auto',
        visibility: 'private',
        magic_prompt: 'on',
        rendering: 'quality',
        num_images: 3
      })
    });

    console.log('Ideogram API response status:', ideogramResponse.status);
    
    if (!ideogramResponse.ok) {
      const errorText = await ideogramResponse.text();
      console.error('Ideogram API error:', errorText);
      return new Response(
        JSON.stringify({ error: `Ideogram API error: ${errorText}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const ideogramData = await ideogramResponse.json();
    console.log('Ideogram API success, received data');

    // For now, just return the image URLs directly for testing
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
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
