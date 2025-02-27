
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";
import { useEffect } from "react";
import { toast } from "sonner";

const Offerings = () => {
  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name");
      return data || [];
    },
  });

  const { data: objectiveEnumValues = [] } = useQuery({
    queryKey: ["offering_objective_enum"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_enum_values', { enum_name: 'offering_objective' });
      if (error) {
        console.error("Error fetching offering_objective enum values:", error);
        return [];
      }
      return data || [];
    },
  });

  const { data: specialCategoryEnumValues = [] } = useQuery({
    queryKey: ["offering_specialcategory_enum"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_enum_values', { enum_name: 'offering_specialcategory' });
      if (error) {
        console.error("Error fetching offering_specialcategory enum values:", error);
        return [];
      }
      return data || [];
    },
  });

  const organizationOptions = organizations.map(org => ({
    value: org.organization_id,
    label: org.organization_name
  }));

  const objectiveOptions = objectiveEnumValues.map(value => ({
    value: value,
    label: value
  }));

  const specialCategoryOptions = specialCategoryEnumValues.map(value => ({
    value: value,
    label: value
  }));

  const columns: ColumnDef[] = [
    {
      field: "offering_name",
      header: "Offering",
      inputMode: "text",
      editable: true,
      required: true
    },
    {
      field: "organization_id",
      header: "Organization",
      inputMode: "select",
      editable: true,
      required: true,
      options: organizationOptions,
      displayField: "organization_name",
      searchField: "label"
    },
    {
      field: "offering_objective",
      header: "Objective",
      inputMode: "select",
      editable: true,
      required: true,
      options: objectiveOptions
    },
    {
      field: "offering_specialcategory",
      header: "Special Category",
      inputMode: "select",
      editable: true,
      required: true,
      options: specialCategoryOptions
    },
    {
      field: "created_at",
      header: "Created",
      inputMode: "text",
      editable: false,
      required: false,
      format: "M/D/YY"
    }
  ];

  const { data = [], refetch } = useQuery({
    queryKey: ["offerings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("b1offerings")
        .select(`
          offering_id,
          offering_name,
          organization_id,
          offering_objective,
          offering_specialcategory,
          created_at,
          a1organizations (
            organization_name
          )
        `);
      
      if (error) {
        toast.error("Failed to fetch offerings");
        throw error;
      }
      
      return (data || []).map(row => ({
        id: row.offering_id,
        offering_name: row.offering_name,
        organization_id: row.organization_id,
        organization_name: row.a1organizations?.organization_name,
        offering_objective: row.offering_objective,
        offering_specialcategory: row.offering_specialcategory,
        created_at: row.created_at
      }));
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('offerings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'b1offerings'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <QuadrantLayout>
      {{
        q4: <SharedTable 
          data={data} 
          columns={columns} 
          tableName="b1offerings" 
          idField="offering_id" 
        />,
      }}
    </QuadrantLayout>
  );
};

export default Offerings;
