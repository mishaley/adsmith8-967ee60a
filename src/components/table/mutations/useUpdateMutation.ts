
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
  
  const mutation = useMutation({
    mutationFn: async ({ rowId, field, value }: UpdateParams) => {      
      const { error, data } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Immediately update the cache with the new data
      queryClient.setQueryData([tableName.toLowerCase()], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((item: any) => 
          item.id === data[0]?.id ? { ...item, ...data[0] } : item
        );
      });
      
      // Also invalidate to ensure we're in sync with the server
      queryClient.invalidateQueries({ queryKey: [tableName.toLowerCase()] });
      toast.success("Updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update: " + error.message);
    }
  });

  return { updateMutation: mutation };
};
