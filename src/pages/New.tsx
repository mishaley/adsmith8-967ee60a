
import QuadrantLayout from "@/components/QuadrantLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const New = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name");
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="max-w-3xl">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border border-transparent p-4 whitespace-nowrap" style={{ width: "1%", minWidth: "fit-content" }}>
                    <span className="font-medium">Organization</span>
                  </td>
                  <td className="border border-transparent p-4" style={{ width: "99%" }}>
                    <div className="relative inline-block w-auto">
                      <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                          {organizations.map((org) => (
                            <SelectItem 
                              key={org.organization_id} 
                              value={org.organization_id}
                            >
                              {org.organization_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default New;
