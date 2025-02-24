
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Captions = () => {
  const { data = [] } = useQuery({
    queryKey: ["captions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("e2captions")
        .select("name:caption_name, created_at");
      return data || [];
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: <SharedTable data={data} />,
      }}
    </QuadrantLayout>
  );
};

export default Captions;
