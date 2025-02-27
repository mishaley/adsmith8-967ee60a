
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
        console.log('Testing Ideogram API...');
        
        // Using the correct Ideogram API endpoint
        const testUrl = 'https://api.ideogram.ai/generate/v1';
        
        const headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Supabase Edge Function'
        };

        // Making a minimal request to test the API
        const testRequest = {
          prompt: "Test prompt for API connection verification",
          style: "base",
          aspect_ratio: "1:1"
        };

        console.log('Making request to:', testUrl);
        const testResponse = await fetch(testUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(testRequest)
        });

        console.log('Test response status:', testResponse.status);
        
        if (!testResponse.ok) {
          const text = await testResponse.text();
          console.log('Error response text:', text);
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

        // Parse the response to get the generation ID or other confirmation
        const responseData = await testResponse.json();
        
        // Return success with some response data for verification
        return new Response(
          JSON.stringify({ 
            status: 'success', 
            message: 'API connection successful',
            response: responseData
          }),
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
