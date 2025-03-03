
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Extract request data
    const requestData = await req.json()
    const { prompt, resolution = "RESOLUTION_1024_1024" } = requestData

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get API key from environment
    const ideogramApiKey = Deno.env.get('IDEOGRAM_API_KEY')
    
    if (!ideogramApiKey) {
      console.error('IDEOGRAM_API_KEY is not set in the environment variables')
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Generating image with prompt: ${prompt}`)
    
    // Call the Ideogram API
    const ideogramResponse = await fetch('https://api.ideogram.ai/api/v1/text2image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ideogramApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "ideogram-1.0",
        prompt: prompt,
        aspect_ratio: resolution,
        style_preset: "enhance"
      }),
    })

    const ideogramData = await ideogramResponse.json()
    console.log('Ideogram API response:', JSON.stringify(ideogramData))

    // Handle successful response
    if (ideogramData.data && ideogramData.data.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: ideogramData.data[0].url
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      // Handle API error
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No image generated', 
          details: ideogramData 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Error generating image:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to generate image',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
