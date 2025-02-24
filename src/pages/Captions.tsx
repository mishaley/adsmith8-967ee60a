
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDefinition } from "@/types/table";

const Captions = () => {
  const columns: ColumnDefinition[] = [
    {
      field: "caption_name",
      header: "Caption",
      inputMode: "text",
      editable: true,
      required: true,
    },
    {
      field: "created_at",
      header: "Created",
      inputMode: "text",
      editable: false,
      required: false,
      format: "M/D/YY",
    },
  ];

  const { data = [] } = useQuery({
    queryKey: ["captions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("e2captions")
        .select("id:caption_id, caption_name, created_at");
      return data || [];
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: (
          <SharedTable
            tableName="e2captions"
            columns={columns}
            data={data}
            refetchKey="captions"
          />
        ),
      }}
    </QuadrantLayout>
  );
};

export default Captions;
