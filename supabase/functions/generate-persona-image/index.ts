
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
    // Check if function was triggered by the clear form action
    const url = new URL(req.url);
    const isClearingForm = url.searchParams.get('clear_form') === 'true';

    if (isClearingForm) {
      console.log("Received clear form request, cleaning up portrait generation resources");
      
      // Handle form clearing specifically
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Cleared portrait generation resources' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Return a simple disabled response without excessive logging
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Portrait generation is temporarily disabled' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in generate-persona-image function:', error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
