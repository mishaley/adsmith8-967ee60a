
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";

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
      displayField: "organization_name"
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

  const { data = [] } = useQuery({
    queryKey: ["offerings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("b1offerings")
        .select(`
          id:offering_id,
          offering_name,
          organization_id,
          organization:a1organizations(organization_name),
          created_at
        `);
      
      return (data || []).map(row => ({
        id: row.id,
        offering_name: row.offering_name,
        organization_id: row.organization_id,
        organization_name: row.organization?.organization_name,
        created_at: row.created_at
      }));
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: <SharedTable data={data} columns={columns} />,
      }}
    </QuadrantLayout>
  );
};

export default Offerings;
