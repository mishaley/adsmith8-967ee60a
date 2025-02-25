
import { TableName } from "@/types/table";
import { useCreateMutation } from "./mutations/useCreateMutation";
import { useUpdateMutation } from "./mutations/useUpdateMutation";
import { useChangeHistory } from "./history/useChangeHistory";
import { useUndoRedo } from "./hooks/useUndoRedo";

interface TableMutationsResult {
  updateMutation: ReturnType<typeof useUpdateMutation>;
  createMutation: ReturnType<typeof useCreateMutation>;
}

export function useTableMutations(
  tableName: TableName,
  idField: string
): TableMutationsResult {
  const createMutation = useCreateMutation(tableName);
  const { addToHistory, undo, redo } = useChangeHistory(
    params => updateMutation.mutateAsync(params)
  );
  
  const updateMutation = useUpdateMutation(
    tableName,
    idField,
    (rowId, field, oldValue, newValue) => addToHistory(rowId, field, oldValue, newValue, tableName)
  );

  useUndoRedo(undo, redo);

  return { updateMutation, createMutation };
}
