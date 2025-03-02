
// Follow the Deno deploy docs here: https://deno.com/deploy/docs

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
    
    // Get the Mapbox token from the environment
    const mapboxToken = Deno.env.get('MAPBOX_TOKEN') || '';
    
    console.log(`Retrieved token: ${mapboxToken ? 'Token exists (first 5 chars: ' + mapboxToken.substring(0, 5) + '...)' : 'No token found'}`);
    
    if (!mapboxToken) {
      console.warn("No Mapbox token found in environment variables");
      return new Response(
        JSON.stringify({ error: 'Mapbox token not configured' }),
        { 
          status: 404, 
          headers: { 
            'Content-Type': 'application/json', 
            ...corsHeaders 
          } 
        }
      )
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
