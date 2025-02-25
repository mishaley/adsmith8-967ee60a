
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

interface UpdateParams {
  rowId: string;
  field: string;
  value: any;
  currentValue: any;
  isUndo?: boolean;
}

type OfferingWithOrg = Database['public']['Tables']['b1offerings']['Row'] & {
  a1organizations: Pick<Database['public']['Tables']['a1organizations']['Row'], 'organization_name'> | null;
};

export const useUpdateMutation = (
  tableName: TableName,
  idField: string,
  onSuccessfulUpdate?: (rowId: string, field: string, oldValue: any, newValue: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value, currentValue, isUndo = false }: UpdateParams) => {
      if (tableName === 'b1offerings') {
        // Handle offerings table separately due to join
        if (value === currentValue) {
          const { data, error } = await supabase
            .from('b1offerings')
            .select('*, a1organizations(organization_name)')
            .eq('offering_id', rowId)
            .maybeSingle();
          
          if (error) throw error;
          if (!data) throw new Error('Failed to fetch data');
          
          const result = {
            ...data,
            organization_name: (data as OfferingWithOrg).a1organizations?.organization_name
          };
          return result;
        }

        const { data, error } = await supabase
          .from('b1offerings')
          .update({ [field]: value })
          .eq('offering_id', rowId)
          .select('*, a1organizations(organization_name)')
          .maybeSingle();
        
        if (error) throw error;
        if (!data) throw new Error('No data returned from update');

        const result = {
          ...data,
          organization_name: (data as OfferingWithOrg).a1organizations?.organization_name
        };

        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, currentValue, value);
        }

        return result;
      } else {
        // Handle all other tables
        if (value === currentValue) {
          const { data, error } = await supabase
            .from(tableName)
            .select()
            .eq(idField, rowId)
            .maybeSingle();
          
          if (error) throw error;
          if (!data) throw new Error('Failed to fetch data');
          return data;
        }

        const { data, error } = await supabase
          .from(tableName)
          .update({ [field]: value })
          .eq(idField, rowId)
          .select()
          .maybeSingle();
        
        if (error) throw error;
        if (!data) throw new Error('No data returned from update');

        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, currentValue, value);
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
