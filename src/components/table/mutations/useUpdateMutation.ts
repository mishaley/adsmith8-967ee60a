
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

type UpdateParams = {
  rowId: string;
  field: string;
  value: string | number;
  currentValue: string | number;
};

const updateRecord = async (
  tableName: TableName, 
  idField: string, 
  params: UpdateParams
) => {
  const { error } = await supabase
    .from(tableName)
    .update({ [params.field]: params.value })
    .eq(idField, params.rowId);

  if (error) throw error;
  return { success: true };
};

export const useUpdateMutation = (tableName: TableName, idField: string) => ({
  updateMutation: useMutation({
    mutationFn: (params: UpdateParams) => updateRecord(tableName, idField, params),
    onError: (error: Error) => {
      toast.error("Failed to update: " + error.message);
    }
  })
});
