
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
    const { dryRun = false } = await req.json().catch(() => ({ dryRun: false }));
    console.log(`Running in ${dryRun ? 'dry run' : 'delete'} mode`);

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

    // Identify invalid folders
    const invalidFolders = storageData
      ?.filter(item => item.name !== '.emptyFolderPlaceholder')
      .filter(item => !validOrgIds.has(item.name))
      .map(item => `organizations/${item.name}`) ?? [];

    console.log('Invalid folders to be removed:', invalidFolders)

    if (dryRun) {
      return new Response(
        JSON.stringify({
          mode: 'dry run',
          message: 'This was a dry run - no files were deleted',
          wouldDelete: invalidFolders,
          validOrgIds: Array.from(validOrgIds),
          foundFolders: storageData?.map(item => item.name) ?? []
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const deletedFolders: string[] = []
    const errors: string[] = []

    // Delete invalid folders and their contents recursively
    for (const folderPath of invalidFolders) {
      try {
        // First, recursively list all contents
        const allContents: string[] = []
        
        // Function to recursively list contents of a folder
        const listFolderContents = async (path: string) => {
          const { data: contents, error: listError } = await supabase
            .storage
            .from('adsmith_assets')
            .list(path, {
              sortBy: { column: 'name', order: 'asc' },
            })

          if (listError) {
            errors.push(`Error listing contents in ${path}: ${listError.message}`)
            return
          }

          if (!contents) return

          for (const item of contents) {
            const fullPath = `${path}/${item.name}`
            if (item.metadata?.mimetype) {
              // It's a file
              allContents.push(fullPath)
            } else {
              // It's a folder, recurse into it
              await listFolderContents(fullPath)
            }
          }
        }

        // List all contents recursively
        await listFolderContents(folderPath)
        
        // Add the .emptyFolderPlaceholder if it exists
        allContents.push(`${folderPath}/.emptyFolderPlaceholder`)

        console.log(`Found files to delete in ${folderPath}:`, allContents)

        // Delete all contents in one operation
        if (allContents.length > 0) {
          const { error: deleteError } = await supabase
            .storage
            .from('adsmith_assets')
            .remove(allContents)

          if (deleteError) {
            errors.push(`Error deleting contents in ${folderPath}: ${deleteError.message}`)
          } else {
            deletedFolders.push(folderPath)
            console.log(`Successfully deleted folder and contents: ${folderPath}`)
          }
        }
      } catch (err) {
        errors.push(`Unexpected error processing ${folderPath}: ${err.message}`)
      }
    }

    return new Response(
      JSON.stringify({
        mode: 'delete',
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
