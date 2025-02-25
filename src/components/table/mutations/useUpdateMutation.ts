
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
        const { error } = await supabase
          .from(tableName)
          .update({ [field]: value })
          .eq(idField, rowId);

        if (error) throw error;

        // Return the updated field and value
        return { id: rowId, [field]: value };
      },
      onSuccess: (updatedData) => {
        // Update the cache by merging the updated field with existing data
        queryClient.setQueryData([tableName.toLowerCase()], (oldData: any[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(item => 
            item.id === updatedData.id ? { ...item, ...updatedData } : item
          );
        });
        toast.success("Updated successfully");
      },
      onError: (error: Error) => {
        toast.error("Failed to update: " + error.message);
      }
    })
  };
};
