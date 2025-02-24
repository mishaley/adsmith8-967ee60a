
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { organization_id } = await req.json()

    if (!organization_id) {
      throw new Error('organization_id is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create empty files to represent folders
    const folders = [
      `organizations/${organization_id}/.keep`,
      `organizations/${organization_id}/data/.keep`,
      `organizations/${organization_id}/docs/.keep`,
      `organizations/${organization_id}/media/.keep`,
    ]

    // Upload empty files to create folder structure
    const uploadPromises = folders.map(async (folder) => {
      const { error } = await supabase
        .storage
        .from('adsmith_assets')
        .upload(folder, new Uint8Array(0))

      if (error && error.message !== 'The resource already exists') {
        throw error
      }
    })

    await Promise.all(uploadPromises)

    console.log(`Created folder structure for organization: ${organization_id}`)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error creating folders:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
