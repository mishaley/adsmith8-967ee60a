
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";

interface UpdateParams {
  rowId: string;
  field: string;
  value: any;
  currentValue: any;
}

interface UpdateResult {
  success: true;
}

export const useUpdateMutation = (tableName: TableName, idField: string) => {
  return useMutation<UpdateResult, Error, UpdateParams>({
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
