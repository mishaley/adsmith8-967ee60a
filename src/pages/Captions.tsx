
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";

const Captions = () => {
  const columns: ColumnDef[] = [
    {
      field: "name",
      header: "Name",
      inputMode: "text",
      editable: false,
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
    queryKey: ["captions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("e2captions")
        .select("id:caption_id, name:caption_name, created_at");
      return data || [];
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

export default Captions;
