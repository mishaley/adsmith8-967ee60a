
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDefinition } from "@/types/table";

const Images = () => {
  const columns: ColumnDefinition[] = [
    {
      field: "image_inputprompt",
      header: "Input Prompt",
      inputMode: "text",
      editable: true,
      required: false,
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
    queryKey: ["images"],
    queryFn: async () => {
      const { data } = await supabase
        .from("e1images")
        .select("id:image_id, image_inputprompt, created_at");
      return data || [];
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: (
          <SharedTable
            tableName="e1images"
            columns={columns}
            data={data}
            refetchKey="images"
          />
        ),
      }}
    </QuadrantLayout>
  );
};

export default Images;
