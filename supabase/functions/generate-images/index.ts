
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const getIdeogramResolution = (aspectRatio: string) => {
  const resolutionMap: Record<string, string> = {
    "1:1": "RESOLUTION_1024_1024",
    "4:5": "RESOLUTION_896_1120",
    "9:16": "RESOLUTION_720_1280",
    "16:9": "RESOLUTION_1280_720",
    "21:11": "RESOLUTION_1344_704"
  };
  return resolutionMap[aspectRatio] || "RESOLUTION_1024_1024";
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image_resolution, image_inputprompt } = await req.json();
    console.log('Received request:', { image_resolution, image_inputprompt });

    if (!image_inputprompt) {
      return new Response(
        JSON.stringify({ error: 'Input prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const ideogramResponse = await fetch('https://api.ideogram.ai/api/v1/images/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('IDEOGRAM_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: image_inputprompt,
        resolution: getIdeogramResolution(image_resolution),
        style: 'auto',
        visibility: 'private',
        magic_prompt: 'on',
        rendering: 'quality',
        num_images: 3
      })
    });

    if (!ideogramResponse.ok) {
      const errorText = await ideogramResponse.text();
      console.error('Ideogram API error:', errorText);
      return new Response(
        JSON.stringify({ error: `Ideogram API error: ${errorText}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const ideogramData = await ideogramResponse.json();
    console.log('Successfully generated images');

    return new Response(
      JSON.stringify({ images: ideogramData.images }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
