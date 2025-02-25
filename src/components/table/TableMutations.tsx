
import { TableName } from "@/types/table";
import { useCreateMutation } from "./mutations/useCreateMutation";
import { useUpdateMutation } from "./mutations/useUpdateMutation";
import { useChangeHistory } from "./history/useChangeHistory";
import { useUndoRedo } from "./hooks/useUndoRedo";
import { supabase } from "@/integrations/supabase/client";

interface UpdateParams {
  rowId: string;
  field: string;
  value: string | number;
  currentValue: string | number;
}

export function useTableMutations(
  tableName: TableName,
  idField: string
) {
  const updateMutation = useUpdateMutation({
    client: supabase,
    table: tableName,
    onSuccess: () => {
      // Success handling if needed
    },
    onError: (error) => {
      console.error('Update error:', error);
    }
  });
  
  const createMutation = useCreateMutation(tableName);
  
  const { addToHistory, undo, redo } = useChangeHistory(
    async (params: UpdateParams) => {
      const result = await updateMutation.mutateAsync({
        id: params.rowId,
        idField: idField,
        data: { [params.field]: params.value }
      });
      return result;
    }
  );

  useUndoRedo(undo, redo);

  return { 
    mutate: (params: UpdateParams) => {
      updateMutation.mutate({
        id: params.rowId,
        idField: idField,
        data: { [params.field]: params.value }
      });
    },
    createMutation 
  };
}
