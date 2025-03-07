
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

  // Define objective options directly like in Personas
  const objectiveOptions = [
    { value: "Sales", label: "Sales" },
    { value: "App", label: "App" }
  ];

  // Define specialCategory options directly like in Personas
  const specialCategoryOptions = [
    { value: "None", label: "None" },
    { value: "Financial products and services", label: "Financial products and services" },
    { value: "Employment", label: "Employment" },
    { value: "Housing", label: "Housing" },
    { value: "Social issues, elections or politics", label: "Social issues, elections or politics" }
  ];

  const organizationOptions = organizations.map(org => ({
    value: org.organization_id,
    label: org.organization_name
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
