
import QuadrantLayout from "@/components/QuadrantLayout";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isTestingCleanup, setIsTestingCleanup] = useState(false);
  const [isDeletingOrgs, setIsDeletingOrgs] = useState(false);

  const { data: organizations = [], refetch } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name, organization_wordmark");
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    organizationId: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(organizationId);

      // Convert to PNG if needed and create a new file object
      const img = new Image();
      const loadImagePromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      const image = await loadImagePromise as HTMLImageElement;
      
      // Create canvas to convert to PNG
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(image, 0, 0);
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to convert to PNG'));
        }, 'image/png');
      });

      // Create timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filePath = `organizations/${organizationId}/docs/${organizationId}_wordmark_${timestamp}.png`;

      // Upload PNG to Supabase storage
      const { data, error } = await supabase.storage
        .from("adsmith_assets")
        .upload(filePath, blob, {
          contentType: 'image/png',
          upsert: false // Don't use upsert to keep historical versions
        });

      if (error) throw error;

      // Update organization record with wordmark path
      const { error: updateError } = await supabase
        .from("a1organizations")
        .update({ 
          organization_wordmark: data.path 
        })
        .eq("organization_id", organizationId);

      if (updateError) throw updateError;

      toast.success("Wordmark uploaded successfully");
      refetch();
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(null);
    }
  };

  const testCleanupFunction = async () => {
    try {
      setIsTestingCleanup(true);
      const { data, error } = await supabase.functions.invoke('cleanup-org-folders', {
        body: { dryRun: true }
      });
      
      if (error) {
        console.error('Cleanup function error:', error);
        toast.error('Failed to test cleanup: ' + error.message);
        return;
      }
      
      console.log('Cleanup function response:', data);
      toast.success('Cleanup test completed successfully! Check console for details.');
    } catch (err) {
      console.error('Error invoking function:', err);
      toast.error('Failed to invoke cleanup function');
    } finally {
      setIsTestingCleanup(false);
    }
  };

  const executeCleanup = async () => {
    try {
      setIsDeletingOrgs(true);
      const { data, error } = await supabase.functions.invoke('cleanup-org-folders', {
        body: { dryRun: false }
      });
      
      if (error) {
        console.error('Cleanup execution error:', error);
        toast.error('Failed to execute cleanup: ' + error.message);
        return;
      }
      
      console.log('Cleanup execution response:', data);
      toast.success('Storage cleanup completed successfully!');
    } catch (err) {
      console.error('Error executing cleanup:', err);
      toast.error('Failed to execute cleanup');
    } finally {
      setIsDeletingOrgs(false);
    }
  };

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="w-full max-w-2xl mx-auto p-4">
            <table className="w-full mb-8">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-[#154851] text-white">Organization</th>
                  <th className="text-left p-4 bg-[#154851] text-white">Wordmark</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr key={org.organization_id} className="border-b">
                    <td className="p-4">{org.organization_name}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {org.organization_wordmark && (
                          <div className="h-8 flex items-center">
                            <img
                              src={`${supabase.storage.from('adsmith_assets').getPublicUrl(org.organization_wordmark).data.publicUrl}`}
                              alt={`${org.organization_name} wordmark`}
                              className="max-h-full w-auto object-contain"
                            />
                          </div>
                        )}
                        <Button
                          variant="outline"
                          className="relative"
                          disabled={isUploading === org.organization_id}
                        >
                          {isUploading === org.organization_id ? (
                            "Uploading..."
                          ) : (
                            org.organization_wordmark ? "Replace" : "Upload"
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleFileChange(e, org.organization_id)}
                            disabled={isUploading === org.organization_id}
                          />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cleanup Section */}
            <div className="p-4 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold mb-2">Storage Cleanup</h2>
              <p className="text-sm text-gray-600 mb-4">
                Manage organization folders in storage. Use test mode first to see which folders would be affected.
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={testCleanupFunction}
                  variant="outline"
                  disabled={isTestingCleanup || isDeletingOrgs}
                >
                  {isTestingCleanup ? 'Testing...' : 'Test Cleanup'}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={isDeletingOrgs || isTestingCleanup}
                    >
                      {isDeletingOrgs ? 'Deleting...' : 'Delete Invalid Folders'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all organization folders that don't match with valid organization IDs in the database.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={executeCleanup}>
                        Yes, Delete Folders
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Settings;
