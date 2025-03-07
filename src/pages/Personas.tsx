
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";
import { useEffect } from "react";

const Personas = () => {
  const { data: offerings = [] } = useQuery({
    queryKey: ["offerings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("b1offerings")
        .select("offering_id, offering_name");
      return data || [];
    },
  });

  const offeringOptions = offerings.map(offering => ({
    value: offering.offering_id,
    label: offering.offering_name
  }));

  const genderOptions = [
    { value: "Women", label: "Women" },
    { value: "Men", label: "Men" },
    { value: "Both", label: "Both" }
  ];

  const columns: ColumnDef[] = [
    {
      field: "persona_name",
      header: "Persona",
      inputMode: "text",
      editable: true,
      required: true
    },
    {
      field: "offering_id",
      header: "Offering",
      inputMode: "select",
      editable: true,
      required: true,
      options: offeringOptions,
      displayField: "offering_name"
    },
    {
      field: "persona_gender",
      header: "Gender",
      inputMode: "select",
      editable: true,
      required: true,
      options: genderOptions
    },
    {
      field: "persona_agemin",
      header: "Age Min",
      inputMode: "text",
      editable: true,
      required: true
    },
    {
      field: "persona_agemax",
      header: "Age Max",
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

  const { data = [], refetch } = useQuery({
    queryKey: ["personas"],
    queryFn: async () => {
      const { data } = await supabase
        .from("c1personas")
        .select(`
          id:persona_id,
          persona_name,
          offering_id,
          offering:b1offerings(offering_name),
          persona_gender,
          persona_agemin,
          persona_agemax,
          created_at
        `);
      
      return (data || []).map(row => ({
        id: row.id,
        persona_name: row.persona_name,
        offering_id: row.offering_id,
        offering_name: row.offering?.offering_name,
        persona_gender: row.persona_gender,
        persona_agemin: row.persona_agemin,
        persona_agemax: row.persona_agemax,
        created_at: row.created_at
      }));
    },
  });

  useEffect(() => {
    // Subscribe to ALL changes on personas table
    const channel = supabase
      .channel('personas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'c1personas'
        },
        () => {
          // Immediately refetch to get the latest data with joined tables
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
        q4: <SharedTable data={data} columns={columns} tableName="c1personas" idField="persona_id" />,
      }}
    </QuadrantLayout>
  );
};

export default Personas;
