
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

type UpdateResponse = {
  success: boolean;
};

const updateRecord = async (
  tableName: TableName, 
  idField: string, 
  { rowId, field, value }: UpdateParams
): Promise<UpdateResponse> => {
  const { error } = await supabase
    .from(tableName)
    .update({ [field]: value })
    .eq(idField, rowId);

  if (error) throw error;
  return { success: true };
};

export const useUpdateMutation = (tableName: TableName, idField: string) => {
  return {
    updateMutation: useMutation({
      mutationFn: (params: UpdateParams) => updateRecord(tableName, idField, params),
      onError: (error: Error) => {
        toast.error("Failed to update: " + error.message);
      }
    })
  };
};
