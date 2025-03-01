
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

    // Log API key details for debugging
    const keyFirstChars = apiKey.substring(0, 4);
    const keyLastChars = apiKey.substring(apiKey.length - 4);
    console.log(`API key found, length: ${apiKey.length}, starts with: ${keyFirstChars}, ends with: ${keyLastChars}`);
    
    // Create headers using Ideogram's recommended format: 'Api-Key' instead of 'Authorization: Bearer'
    const apiHeaders = new Headers({
      'Api-Key': apiKey,
      'Content-Type': 'application/json'
    });
    
    // Log the complete headers for debugging
    console.log("Request headers being sent:");
    apiHeaders.forEach((value, key) => {
      // Only show partial API key in logs
      if (key.toLowerCase() === 'api-key') {
        console.log(`${key}: ${keyFirstChars}...${keyLastChars}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });
    
    console.log("Sending request to Ideogram API...");
    
    // Using the format from Ideogram's documentation
    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify({
        image_request: {
          prompt: "Cutest puppy in the world",
          aspect_ratio: "ASPECT_1_1",
          model: "V_2",
          magic_prompt_option: "AUTO"
        }
      }),
    });

    console.log('Ideogram API response status:', response.status);
    console.log('Ideogram API response headers:');
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    
    // Parse the response
    let data;
    try {
      const responseText = await response.text();
      console.log('Raw response text length:', responseText.length);
      console.log('Raw response text preview:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
      
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', JSON.stringify(data).substring(0, 500) + '...');
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        data = { error: 'Unable to parse response as JSON', rawResponse: responseText.substring(0, 200) };
      }
    } catch (e) {
      console.error('Error reading response:', e);
      data = { error: 'Unable to read response' };
    }
    
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
          data: data // Include the full response data for debugging
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      console.error('Error response from Ideogram API:', data);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: data.error || 'Error connecting to Ideogram API',
          details: data,
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
