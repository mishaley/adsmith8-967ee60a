
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
  const updateMutation = useUpdateMutation(tableName, idField);
  
  const { addToHistory, undo, redo } = useChangeHistory(
    params => updateMutation.mutateAsync(params)
  );

  useUndoRedo(undo, redo);

  return { updateMutation, createMutation };
}
