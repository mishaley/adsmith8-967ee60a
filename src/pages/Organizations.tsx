
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";

const Organizations = () => {
  const columns: ColumnDef[] = [
    {
      field: "organization_name",
      header: "Organization",
      inputMode: "text",
      editable: true,
      required: true
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
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("a1organizations")
        .select("id:organization_id, organization_name, created_at");
      return data || [];
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: <SharedTable 
          data={data} 
          columns={columns} 
          tableName="a1organizations" 
          idField="organization_id" 
        />,
      }}
    </QuadrantLayout>
  );
};

export default Organizations;
