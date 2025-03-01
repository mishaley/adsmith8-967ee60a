
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Allowed CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Edge function get-mapbox-token called");
    
    // Get the Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    console.log("Supabase URL available:", !!supabaseUrl);
    console.log("Supabase key available:", !!supabaseKey);

    // Get the Mapbox token from the environment
    const mapboxToken = Deno.env.get('MAPBASE_TOKEN') || Deno.env.get('MAPBOX_TOKEN') || '';
    
    console.log(`Retrieved token: ${mapboxToken ? 'Token exists' : 'No token found'}`);
    
    if (!mapboxToken) {
      console.warn("No Mapbox token found in environment variables. Checking for both MAPBASE_TOKEN and MAPBOX_TOKEN.");
      
      // List all available environment variables (ONLY for debugging, remove in production)
      console.log("Available environment variables:", Object.keys(Deno.env.toObject()));
    }
    
    return new Response(
      JSON.stringify({ mapboxToken }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        } 
      }
    )
  }
}
