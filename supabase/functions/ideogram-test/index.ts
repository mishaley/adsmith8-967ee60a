
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
    
    // Create headers explicitly with the correct Authorization format
    const apiHeaders = new Headers({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    });
    
    // Log the complete headers for debugging
    console.log("Request headers being sent:");
    apiHeaders.forEach((value, key) => {
      // Only show partial API key in logs
      if (key.toLowerCase() === 'authorization') {
        console.log(`${key}: Bearer ${keyFirstChars}...${keyLastChars}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });
    
    console.log("Sending request to Ideogram API...");
    
    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify({
        prompt: 'test connection only',
        aspect_ratio: "1:1", 
        cfg_scale: 7.5
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
      console.log('Raw response text:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        data = { error: 'Unable to parse response as JSON', rawResponse: responseText };
      }
    } catch (e) {
      console.error('Error reading response:', e);
      data = { error: 'Unable to read response' };
    }
    
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
