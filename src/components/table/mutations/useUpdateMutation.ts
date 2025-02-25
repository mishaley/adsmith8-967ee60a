
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

// Simplified type definitions to avoid deep nesting
type BaseOffering = Database['public']['Tables']['b1offerings']['Row'];
type BaseOrganization = Database['public']['Tables']['a1organizations']['Row'];

type OfferingWithOrg = BaseOffering & {
  a1organizations: Pick<BaseOrganization, 'organization_name'> | null;
}

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
          .select('*, a1organizations!inner(organization_name)')
          .maybeSingle();
        
        if (error) throw error;
        if (!data) throw new Error('No data returned from update');
        
        const result = data as OfferingWithOrg;
        
        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, result[field], value);
        }
        
        return result;
      } else {
        const { data, error } = await table
          .update(updateData)
          .eq(idField, rowId)
          .select()
          .maybeSingle();
        
        if (error) throw error;
        if (!data) throw new Error('No data returned from update');
        
        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, data[field], value);
        }
        
        return data;
      }
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to update: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
      toast.success("Update successful");
    },
  });
};
