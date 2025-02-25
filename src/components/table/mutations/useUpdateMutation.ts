
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

interface UpdateParams {
  rowId: string;
  field: string;
  value: string | number;
  currentValue: string | number;
}

export const useUpdateMutation = (tableName: TableName, idField: string) => {
  const queryClient = useQueryClient();
  
  return {
    updateMutation: useMutation({
      mutationFn: async ({ rowId, field, value }: UpdateParams) => {      
        const { error, data } = await supabase
          .from(tableName)
          .update({ [field]: value })
          .eq(idField, rowId)
          .select(`
            ${idField},
            message_name,
            persona_id,
            message_type,
            message_url,
            message_status,
            created_at,
            persona:c1personas(persona_name)
          `);

        if (error) throw error;
        
        // Transform the data to match the expected format
        const transformedData = data?.[0] ? {
          id: data[0][idField],
          message_name: data[0].message_name,
          persona_id: data[0].persona_id,
          persona_name: data[0].persona?.persona_name,
          message_type: data[0].message_type,
          message_url: data[0].message_url,
          message_status: data[0].message_status,
          created_at: data[0].created_at
        } : null;

        return transformedData;
      },
      onSuccess: (data) => {
        if (data) {
          // Update the cache with the transformed data
          queryClient.setQueryData([tableName.toLowerCase()], (oldData: any[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.map(item => 
              item.id === data.id ? data : item
            );
          });
        }
        toast.success("Updated successfully");
      },
      onError: (error: Error) => {
        toast.error("Failed to update: " + error.message);
      }
    })
  };
};
