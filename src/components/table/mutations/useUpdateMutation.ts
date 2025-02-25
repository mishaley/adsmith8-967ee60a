
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";

interface UpdateParams {
  rowId: string;
  field: string;
  value: string;
  currentValue: string;
}

interface UpdateResult {
  success: boolean;
}

export const useUpdateMutation = (
  tableName: TableName, 
  idField: string
): UseMutationResult<UpdateResult, Error, UpdateParams> => {
  return useMutation({
    mutationFn: async ({ rowId, field, value }) => {      
      const { error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId);

      if (error) throw error;
      return { success: true };
    }
  });
};
