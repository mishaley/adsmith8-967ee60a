
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName, TableData } from "@/types/table";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];

interface TableMutationsResult<T extends TableName> {
  updateMutation: ReturnType<typeof useMutation>;
  createMutation: ReturnType<typeof useMutation>;
}

export function useTableMutations<T extends TableName>(
  tableName: T,
  idField: string
): TableMutationsResult<T> {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value }: { rowId: string; field: string; value: any }) => {
      type TableUpdate = Tables[T]['Update'];
      const table = supabase.from(tableName);
      const updateData = { [field]: value } as TableUpdate;
      
      const { error } = await (table as any)
        .update(updateData)
        .eq(idField, rowId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
    },
  });

  const createMutation = useMutation({
    mutationKey: [tableName, 'create'],
    mutationFn: async (record: Partial<TableData<T>>) => {
      type TableInsert = Tables[T]['Insert'];
      const table = supabase.from(tableName);
      const insertData = record as unknown as TableInsert;
      
      const { data, error } = await (table as any)
        .insert([insertData])
        .select();
      
      if (error) throw error;
      
      if (tableName === 'a1organizations' && data?.[0]?.organization_id) {
        const { error: folderError } = await supabase.functions.invoke('create-org-folders', {
          body: { organization_id: data[0].organization_id }
        });
        
        if (folderError) {
          console.error('Error creating folders:', folderError);
          toast.error("Organization created but failed to create folders");
          throw folderError;
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
      toast.success("Record created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create record: " + error.message);
    }
  });

  return { updateMutation, createMutation };
}
