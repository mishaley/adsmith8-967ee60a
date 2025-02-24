
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

interface CreateMutationParams {
  tableName: TableName;
  idField: string;
}

export function useCreateMutation({ 
  tableName, 
  idField 
}: CreateMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [tableName, 'create'],
    mutationFn: async (record: any) => {      
      const { data, error } = await supabase
        .from(tableName)
        .insert([record])
        .select();
      
      if (error) throw error;
      
      if (tableName === 'a1organizations' && data?.[0]) {
        const orgId = data[0][idField];
        if (orgId) {
          const { error: folderError } = await supabase.functions.invoke('create-org-folders', {
            body: { organization_id: orgId }
          });
          
          if (folderError) {
            console.error('Error creating folders:', folderError);
            toast.error("Organization created but failed to create folders");
            throw folderError;
          }
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
      toast.success("Record created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create record: " + error.message);
    }
  });
}
