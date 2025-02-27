
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
    
    // If test parameter is present, verify the API key
    if (body.test === true) {
      try {
        console.log('Testing API key...');
        console.log('API Key first 4 chars:', apiKey.substring(0, 4));
        
        // Let's try with the API endpoint
        const testUrl = 'https://api.ideogram.ai/api/v1/me';
        console.log('Testing API endpoint:', testUrl);
        
        const headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'User-Agent': 'Supabase Edge Function'
        };
        console.log('Request headers:', headers);

        const testResponse = await fetch(testUrl, {
          method: 'GET',
          headers
        });

        console.log('Test response status:', testResponse.status);
        console.log('Test response headers:', Object.fromEntries(testResponse.headers.entries()));
        
        const responseText = await testResponse.text();
        console.log('Raw response:', responseText);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
          console.log('Parsed response:', responseData);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          console.error('Response text:', responseText);
          return new Response(
            JSON.stringify({ 
              error: 'Invalid response from Ideogram API',
              details: `Status: ${testResponse.status}, Response: ${responseText.substring(0, 200)}`
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }

        if (!testResponse.ok) {
          console.error('API Key validation failed:', responseData);
          return new Response(
            JSON.stringify({ 
              error: 'Invalid API key',
              details: responseData,
              status: testResponse.status
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }

        return new Response(
          JSON.stringify({ status: 'API Key is valid' }),
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

    // Image generation logic
    const prompt = body.prompt || "Cute doggy";
    console.log('Generating image with prompt:', prompt);
    
    try {
      const generateUrl = 'https://api.ideogram.ai/api/v1/images';
      console.log('Using generation endpoint:', generateUrl);

      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Supabase Edge Function'
      };
      console.log('Generation request headers:', headers);

      const response = await fetch(generateUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt })
      });

      console.log('Generation response status:', response.status);
      console.log('Generation response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw generation response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed generation response:', data);
      } catch (e) {
        console.error('Failed to parse generation response as JSON:', e);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid response from Ideogram API',
            details: `Status: ${response.status}, Response: ${responseText.substring(0, 200)}`
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }

      if (!response.ok) {
        console.error('Image generation failed:', data);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate image',
            details: data,
            status: response.status
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }

      // Fixed response format handling
      let image_url = null;
      
      // Handle different response formats from Ideogram API
      if (data.url) {
        // Direct URL in the response
        image_url = data.url;
      } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        // URL in the first item of the data array
        image_url = data.data[0].url;
      } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        // Some APIs return an images array
        image_url = data.images[0].url;
      }

      if (!image_url) {
        console.error('Unexpected response format:', data);
        return new Response(
          JSON.stringify({ 
            error: 'No image URL found in response', 
            response_format: JSON.stringify(data).substring(0, 100) + '...' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }

      console.log('Successfully generated image URL:', image_url);
      return new Response(
        JSON.stringify({ image_url }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } catch (error) {
      console.error('Image generation error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate image',
          details: error.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
