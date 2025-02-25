
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables']

interface UpdateParams {
  rowId: string;
  field: string;
  value: any;
  isUndo?: boolean;
}

export const useUpdateMutation = (
  tableName: TableName,
  idField: string,
  onSuccessfulUpdate?: (rowId: string, field: string, oldValue: any, newValue: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value, isUndo = false }: UpdateParams) => {
      const table = supabase.from(tableName);
      const updateData = { [field]: value };

      if (tableName === 'b1offerings') {
        const { data, error } = await table
          .update(updateData)
          .eq(idField, rowId)
          .select(`
            offering_id,
            offering_name,
            organization_id,
            created_at,
            a1organizations (
              organization_name
            )
          `).single();
        
        if (error) throw error;
        if (!data) throw new Error('No data returned from update');
        
        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, data[field], value);
        }
        
        return data;
      } else {
        const { data, error } = await table
          .update(updateData)
          .eq(idField, rowId)
          .select()
          .single();
        
        if (error) throw error;
        if (!data) throw new Error('No data returned from update');
        
        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, data[field], value);
        }
        
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
      toast.success("Update successful");
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to update: ${error.message}`);
    }
  });
};
