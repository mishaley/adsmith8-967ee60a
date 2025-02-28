
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
    console.log("Testing connection to Ideogram API");
    
    const apiKey = Deno.env.get('IDEOGRAM_API_KEY');
    
    if (!apiKey) {
      console.error('IDEOGRAM_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'API key not configured. Please add IDEOGRAM_API_KEY to Edge Function secrets.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log("API key found, length:", apiKey.length);
    
    // Test the API with minimal parameters
    console.log("Sending test request to Ideogram API");
    const response = await fetch('https://api.ideogram.ai/api/v1/health', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Ideogram API response status:', response.status);
    
    if (response.ok) {
      console.log('Successfully connected to Ideogram API');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully connected to Ideogram API'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      // Try to parse response body
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: 'Unable to parse error response' };
      }
      
      console.error('Error response from Ideogram API:', errorData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Error connecting to Ideogram API',
          details: errorData,
          status: response.status
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
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
