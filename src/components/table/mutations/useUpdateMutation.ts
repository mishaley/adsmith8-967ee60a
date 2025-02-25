
import { useMutation } from "@tanstack/react-query";
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
  return {
    updateMutation: useMutation({
      mutationFn: async ({ rowId, field, value }: UpdateParams) => {      
        const { error } = await supabase
          .from(tableName)
          .update({ [field]: value })
          .eq(idField, rowId);

        if (error) throw error;
        return { success: true };
      },
      onError: (error: Error) => {
        toast.error("Failed to update: " + error.message);
      }
    })
  };
};
