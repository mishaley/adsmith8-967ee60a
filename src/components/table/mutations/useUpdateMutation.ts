
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

type OfferingWithOrg = {
  offering_id: string;
  offering_name: string;
  organization_id: string;
  created_at: string;
  organization_name?: string | null;
};

export const useUpdateMutation = (
  tableName: TableName,
  idField: string,
  onSuccessfulUpdate?: (rowId: string, field: string, oldValue: any, newValue: any) => void
) => {
  const queryClient = useQueryClient();

  const fetchData = async (id: string) => {
    if (tableName === 'b1offerings') {
      const { data, error } = await supabase
        .from('b1offerings')
        .select(`
          offering_id,
          offering_name,
          organization_id,
          created_at,
          a1organizations (
            organization_name
          )
        `)
        .eq('offering_id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;

      return {
        offering_id: data.offering_id,
        offering_name: data.offering_name,
        organization_id: data.organization_id,
        created_at: data.created_at,
        organization_name: data.a1organizations?.organization_name
      };
    } else {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq(idField, id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  };

  return useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value, currentValue, isUndo = false }: UpdateParams) => {
      if (value === currentValue) {
        const data = await fetchData(rowId);
        if (!data) throw new Error('Failed to fetch data');
        return data;
      }

      if (tableName === 'b1offerings') {
        const { data, error } = await supabase
          .from('b1offerings')
          .update({ [field]: value })
          .eq('offering_id', rowId)
          .select(`
            offering_id,
            offering_name,
            organization_id,
            created_at,
            a1organizations (
              organization_name
            )
          `)
          .maybeSingle();
        
        if (error) throw error;
        if (!data) throw new Error('No data returned from update');

        const result = {
          offering_id: data.offering_id,
          offering_name: data.offering_name,
          organization_id: data.organization_id,
          created_at: data.created_at,
          organization_name: data.a1organizations?.organization_name
        };

        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, currentValue, value);
        }

        return result;
      } else {
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
      // Invalidate both organizations and offerings queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Update successful");
    },
  });
};
