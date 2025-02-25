
import QuadrantLayout from "@/components/QuadrantLayout";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const Settings = () => {
  const [isUploading, setIsUploading] = useState<string | null>(null);

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
          upsert: false
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

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="w-full max-w-2xl mx-auto p-4">
            <table className="w-full">
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
                              src={`${supabase.storageClient.getPublicUrl('adsmith_assets', org.organization_wordmark).data.publicUrl}`}
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
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Settings;

