
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
    console.log('API key available:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');
    
    if (!apiKey) {
      console.error('IDEOGRAM_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ 
          error: 'IDEOGRAM_API_KEY not configured',
          message: 'Please add the IDEOGRAM_API_KEY secret in the Supabase dashboard under Edge Functions > Settings > Secrets'
        }),
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
        const testUrl = 'https://api.ideogram.ai/generate';
        
        const headers = {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        };

        console.log('Request headers:', JSON.stringify({
          Authorization: apiKey ? '[REDACTED]' : 'undefined',
          'Content-Type': 'application/json'
        }));
        console.log('Making request to:', testUrl);
        
        // Making a minimal request based on the documentation
        const testRequest = {
          prompt: "test image",
          style: "photographic",
          aspect_ratio: "1:1",
          steps: 25
        };

        console.log('Request body:', JSON.stringify(testRequest));

        const testResponse = await fetch(testUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(testRequest)
        });

        console.log('Test response status:', testResponse.status);
        
        if (!testResponse.ok) {
          let errorText = await testResponse.text();
          console.error('API error response:', errorText);
          
          let errorDetails;
          try {
            errorDetails = JSON.parse(errorText);
          } catch (e) {
            errorDetails = errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '');
          }
          
          return new Response(
            JSON.stringify({ 
              error: 'API connection failed',
              details: errorDetails,
              status: testResponse.status
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }

        // Parse the response to get confirmation
        const responseData = await testResponse.json();
        console.log('API test successful');
        
        // Return success with some response data for verification
        return new Response(
          JSON.stringify({ 
            status: 'success', 
            message: 'API connection successful',
            data: responseData
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (error) {
        console.error('Error testing API:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to connect to the API',
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
