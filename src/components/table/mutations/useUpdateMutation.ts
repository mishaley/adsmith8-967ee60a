
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

interface UpdateParams {
  rowId: string;
  field: string;
  value: string | number;
  currentValue: string | number;
}

interface UpdateResult {
  success: boolean;
}

const updateRecord = async (
  tableName: TableName, 
  idField: string, 
  params: UpdateParams
): Promise<UpdateResult> => {
  const { error } = await supabase
    .from(tableName)
    .update({ [params.field]: params.value })
    .eq(idField, params.rowId);

  if (error) throw error;
  return { success: true };
};

export const useUpdateMutation = (
  tableName: TableName, 
  idField: string
): { updateMutation: UseMutationResult<UpdateResult, Error, UpdateParams> } => {
  return {
    updateMutation: useMutation<UpdateResult, Error, UpdateParams>({
      mutationFn: (params) => updateRecord(tableName, idField, params)
    })
  };
};
