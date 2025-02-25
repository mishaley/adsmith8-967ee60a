
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

export const useCreateMutation = (tableName: TableName) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [tableName, 'create'],
    mutationFn: async (record: any) => {
      const table = supabase.from(tableName);
      
      if (tableName === 'b1offerings') {
        const { data, error } = await table
          .insert([record])
          .select(`*, a1organizations (organization_name)`);
        
        if (error) throw error;
        if (!data?.length) throw new Error('No data returned from insert');
        
        return data[0];
      } else {
        const { data, error } = await table
          .insert([record])
          .select();
        
        if (error) throw error;
        if (!data?.length) throw new Error('No data returned from insert');

        if (tableName === 'a1organizations') {
          const organizationId = (data[0] as { organization_id: string }).organization_id;
          if (organizationId) {
            const { error: folderError } = await supabase.functions.invoke('create-org-folders', {
              body: { organization_id: organizationId }
            });
            
            if (folderError) {
              console.error('Error creating folders:', folderError);
              toast.error("Organization created but failed to create folders");
              throw folderError;
            }
          }
        }
        
        return data[0];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
      toast.success("Record created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create record: " + error.message);
    }
  });
};
