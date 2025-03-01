
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Set up the specific prompt for puppies
const PUPPY_PROMPT = "Cutest puppy in the world";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the API key from environment variables
    const apiKey = Deno.env.get('IDEOGRAM_API_KEY');
    
    if (!apiKey) {
      console.error('IDEOGRAM_API_KEY is not set');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'API key is not configured'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    // Define the API endpoint
    const apiUrl = 'https://api.ideogram.ai/api/v1/images/generation';

    // Set up the request payload with our fixed puppy prompt
    const payload = {
      prompt: PUPPY_PROMPT,
      style_type: 'GENERAL',
      resolution: '1024x1024',
      num_images: 1,
    };

    console.log('Sending request to Ideogram API:', JSON.stringify(payload));

    // Make the request to the Ideogram API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    // Get the response text and try to parse it as JSON
    const responseText = await response.text();
    console.log('Raw API Response:', responseText.substring(0, 500) + '...');
    
    let data;
    
    // Only try to parse if the response text isn't empty
    if (responseText) {
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', JSON.stringify(data).substring(0, 500) + '...');
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        data = { error: 'Unable to parse response as JSON', rawResponse: responseText.substring(0, 200) };
      }
    } else {
      console.error('Empty response from API');
      data = { error: 'Empty response from API' };
    }
    
    // Check if the request was successful
    if (response.ok) {
      console.log('Successfully connected to Ideogram API');
      
      // Handle both potential response formats
      let imageUrl = null;
      
      // Check if image URLs are available in the older response format
      if (data && data.image_urls && data.image_urls.length > 0) {
        imageUrl = data.image_urls[0];
        console.log('Image URL found (image_urls format):', imageUrl);
      } 
      // Check for the new response format where image URL is in data[0].url
      else if (data && data.data && data.data.length > 0 && data.data[0].url) {
        imageUrl = data.data[0].url;
        console.log('Image URL found (data[0].url format):', imageUrl);
      } else {
        console.log('No image URLs found in the response');
      }
      
      // Return the data with the image URL
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully connected to Ideogram API',
          imageUrl: imageUrl,
          prompt: PUPPY_PROMPT,
          data: data // Include the full response data for debugging
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      // Handle API errors
      console.error('API request failed with status:', response.status);
      console.error('API error details:', data);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `API request failed with status ${response.status}`,
          details: data
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status
        }
      );
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Unexpected error',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})
