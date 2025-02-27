
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
    console.log('Testing Ideogram API...');
    
    const testUrl = 'https://api.ideogram.ai/v1/generate';
    const apiKey = 'gRnfkVD3ppItes1zG9TSih2_x-ZZo3K2h7oIMcQyNs5WbBSJ9SLKeJWJVxyjuh2yNhKiMi6OjnWPnE2WhnA39Q';
    
    const headers = {
      'Authorization': apiKey,
      'Content-Type': 'application/json'
    };

    console.log('Making request to:', testUrl);
    
    // Making a minimal request
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
});
