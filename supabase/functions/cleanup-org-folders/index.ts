
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get list of valid organization IDs
    const { data: organizations, error: orgError } = await supabase
      .from('a1organizations')
      .select('organization_id')

    if (orgError) throw orgError

    const validOrgIds = new Set(organizations.map(org => org.organization_id))
    console.log('Valid organization IDs:', Array.from(validOrgIds))

    // List all folders in the organizations directory
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('adsmith_assets')
      .list('organizations', {
        limit: 100,
        offset: 0
      })

    if (storageError) throw storageError
    console.log('Found storage folders:', storageData)

    const invalidFolders = storageData
      .filter(item => item.name !== '.emptyFolderPlaceholder')
      .filter(item => !validOrgIds.has(item.name))
      .map(item => `organizations/${item.name}`)

    console.log('Invalid folders to remove:', invalidFolders)

    const deletedFolders: string[] = []
    const errors: string[] = []

    // Delete invalid folders and their contents recursively
    for (const folderPath of invalidFolders) {
      // List all files in the folder
      const { data: files, error: listError } = await supabase
        .storage
        .from('adsmith_assets')
        .list(folderPath, {
          sortBy: { column: 'name', order: 'asc' },
        })

      if (listError) {
        errors.push(`Error listing files in ${folderPath}: ${listError.message}`)
        continue
      }

      // Delete all files in the folder
      if (files && files.length > 0) {
        const filePaths = files.map(file => `${folderPath}/${file.name}`)
        const { error: deleteFilesError } = await supabase
          .storage
          .from('adsmith_assets')
          .remove(filePaths)

        if (deleteFilesError) {
          errors.push(`Error deleting files in ${folderPath}: ${deleteFilesError.message}`)
        }
      }

      // After files are deleted, try to remove the empty folder
      const { error: deleteFolderError } = await supabase
        .storage
        .from('adsmith_assets')
        .remove([`${folderPath}/.emptyFolderPlaceholder`])

      if (deleteFolderError) {
        errors.push(`Error deleting folder ${folderPath}: ${deleteFolderError.message}`)
      } else {
        deletedFolders.push(folderPath)
        console.log(`Successfully deleted folder: ${folderPath}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cleanup completed',
        deleted: deletedFolders,
        errors: errors
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Cleanup error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
