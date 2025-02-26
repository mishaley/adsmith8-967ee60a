
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message_id, image_format, image_resolution, image_style, image_model, image_inputprompt } = await req.json();

    // Input validation
    if (!message_id || !image_format || !image_resolution || !image_inputprompt) {
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
      return new Response(
        JSON.stringify({ error: 'Could not resolve organization ID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Call Ideogram API
    const ideogramResponse = await fetch('https://api.ideogram.ai/api/v1/images/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('IDEOGRAM_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: image_inputprompt,
        resolution: image_resolution,
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
        JSON.stringify({ error: 'Failed to generate images' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const ideogramData: IdeogramResponse = await ideogramResponse.json();

    // Process and store each image
    const imageRecords = await Promise.all(
      ideogramData.images.map(async (image) => {
        const imageResponse = await fetch(image.url);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image from ${image.url}`);
        }

        const imageBlob = await imageResponse.blob();
        const imageId = crypto.randomUUID();
        const imagePath = `organizations/${organization_id}/media/${imageId}.png`;

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

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('adsmith_assets')
          .getPublicUrl(imagePath);

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
