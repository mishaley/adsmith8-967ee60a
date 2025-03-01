
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const { original, corrected } = await req.json();
    
    if (!original || !corrected) {
      throw new Error('Both original and corrected transcriptions are required');
    }

    // Create a Supabase client with the Supabase URL and key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First, check if this exact correction pair already exists
    const { data: existingCorrections, error: queryError } = await supabaseAdmin
      .from('transcription_corrections')
      .select('*')
      .eq('original_text', original)
      .eq('corrected_text', corrected);

    if (queryError) {
      throw queryError;
    }

    // If the correction doesn't exist yet, insert it
    if (!existingCorrections || existingCorrections.length === 0) {
      const { error: insertError } = await supabaseAdmin
        .from('transcription_corrections')
        .insert({
          original_text: original,
          corrected_text: corrected,
          correction_count: 1
        });

      if (insertError) {
        throw insertError;
      }
    } else {
      // If the correction already exists, increment the count
      const { error: updateError } = await supabaseAdmin
        .from('transcription_corrections')
        .update({ 
          correction_count: existingCorrections[0].correction_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCorrections[0].id);

      if (updateError) {
        throw updateError;
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error saving transcription correction:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
