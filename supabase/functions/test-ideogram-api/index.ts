
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
    const apiKey = Deno.env.get('IDEOGRAM_API_KEY');
    if (!apiKey) {
      console.error('IDEOGRAM_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'IDEOGRAM_API_KEY not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    // Test the API key
    if (body.test === true) {
      try {
        console.log('Testing API key...');
        
        // Testing with a simple endpoint that just verifies authentication
        const testUrl = 'https://api.ideogram.ai/api/v1/me';
        
        const headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'User-Agent': 'Supabase Edge Function'
        };

        const testResponse = await fetch(testUrl, {
          method: 'GET',
          headers
        });

        console.log('Test response status:', testResponse.status);
        
        if (!testResponse.ok) {
          const text = await testResponse.text();
          let errorDetails;
          
          try {
            errorDetails = JSON.parse(text);
          } catch (e) {
            errorDetails = text.substring(0, 200) + (text.length > 200 ? '...' : '');
          }
          
          return new Response(
            JSON.stringify({ 
              error: 'API Key validation failed',
              details: errorDetails,
              status: testResponse.status
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }

        // If we got here, the API key is valid
        return new Response(
          JSON.stringify({ status: 'success', message: 'API Key is valid' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (error) {
        console.error('Error testing API key:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to validate API key',
            details: error.message
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
