
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IdeogramResponse {
  images: Array<{
    url: string;
  }>;
  prompt: string;
}

// Map UI resolution values to Ideogram API values
const resolutionMap: Record<string, string> = {
  '1:1': 'RESOLUTION_1024_1024',
  '4:5': 'RESOLUTION_896_1120',
  '9:16': 'RESOLUTION_720_1280',
  '16:9': 'RESOLUTION_1280_720',
  '21:11': 'RESOLUTION_1344_704'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting image generation request');
    const { message_id, image_format, image_resolution, image_style, image_model, image_inputprompt } = await req.json();
    console.log('Received params:', { message_id, image_format, image_resolution, image_style, image_model, image_inputprompt });

    // Input validation
    if (!message_id || !image_format || !image_resolution || !image_inputprompt) {
      console.error('Missing required fields:', { message_id, image_format, image_resolution, image_inputprompt });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Resolving organization ID for message:', message_id);
    // Get organization_id through the relationship chain
    const { data: messageData, error: messageError } = await supabase
      .from('d1messages')
      .select(`
        persona_id,
        c1personas (
          offering_id,
          b1offerings (
            organization_id
          )
        )
      `)
      .eq('message_id', message_id)
      .single();

    if (messageError || !messageData) {
      console.error('Error fetching message data:', messageError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch message data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const organization_id = messageData.c1personas?.b1offerings?.organization_id;
    if (!organization_id) {
      console.error('Could not resolve organization ID from message data:', messageData);
      return new Response(
        JSON.stringify({ error: 'Could not resolve organization ID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Resolved organization_id:', organization_id);

    // Map the UI resolution value to Ideogram API value
    const apiResolution = resolutionMap[image_resolution];
    if (!apiResolution) {
      console.error('Invalid resolution value:', image_resolution);
      return new Response(
        JSON.stringify({ error: 'Invalid resolution value' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Calling Ideogram API');
    // Call Ideogram API
    const ideogramResponse = await fetch('https://api.ideogram.ai/api/v1/images/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('IDEOGRAM_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: image_inputprompt,
        resolution: apiResolution,
        style: image_style || 'auto',
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
        JSON.stringify({ error: `Failed to generate images: ${errorText}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const ideogramData: IdeogramResponse = await ideogramResponse.json();
    console.log('Received response from Ideogram API');

    // Process and store each image
    console.log('Processing generated images');
    const imageRecords = await Promise.all(
      ideogramData.images.map(async (image, index) => {
        console.log(`Processing image ${index + 1}`);
        const imageResponse = await fetch(image.url);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image from ${image.url}`);
        }

        const imageBlob = await imageResponse.blob();
        const imageId = crypto.randomUUID();
        const imagePath = `organizations/${organization_id}/media/${imageId}.png`;

        console.log(`Uploading image ${index + 1} to storage path:`, imagePath);
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('adsmith_assets')
          .upload(imagePath, imageBlob, {
            contentType: 'image/png',
            upsert: false
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw uploadError;
        }

        // Create database record
        return {
          image_id: imageId,
          message_id,
          image_format,
          image_resolution,
          image_style,
          image_model,
          image_inputprompt,
          image_magicprompt: ideogramData.prompt,
          image_storage: imagePath,
          image_status: 'Generated'
        };
      })
    );

    console.log('Saving image records to database');
    // Insert all image records
    const { error: dbError } = await supabase
      .from('e1images')
      .insert(imageRecords);

    if (dbError) {
      console.error('Database insert error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save image records' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Successfully completed image generation process');
    return new Response(
      JSON.stringify({ success: true, images: imageRecords }),
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
