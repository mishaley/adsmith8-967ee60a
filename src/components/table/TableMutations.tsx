
import { TableName } from "@/types/table";
import { useCreateMutation } from "./mutations/useCreateMutation";
import { useUpdateMutation } from "./mutations/useUpdateMutation";
import { useChangeHistory } from "./history/useChangeHistory";
import { useUndoRedo } from "./hooks/useUndoRedo";

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
  const { updateMutation } = useUpdateMutation(tableName, idField);
  const createMutation = useCreateMutation(tableName);
  
  const { addToHistory, undo, redo } = useChangeHistory(
    async (params) => {
      const result = await updateMutation.mutateAsync(params);
      return result;
    }
  );

  useUndoRedo(undo, redo);

  return { 
    mutate: updateMutation.mutate,
    createMutation 
  };
}
