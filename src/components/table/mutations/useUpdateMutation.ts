
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
  
  return useMutation<void, Error, UpdateParams>({
    mutationFn: async ({ rowId, field, value }) => {      
      const { error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.toLowerCase()] });
      toast.success("Updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update: " + error.message);
    }
  });
};
