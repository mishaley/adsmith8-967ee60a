
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";

interface UpdateParams {
  rowId: string;
  field: string;
  value: any;
  currentValue: any;
}

export const useUpdateMutation = (tableName: TableName, idField: string) => {
  return useMutation({
    mutationFn: async ({ rowId, field, value }: UpdateParams) => {      
      const { error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId);

      if (error) throw error;
      
      return { rowId, field, value };
    }
  });
};
