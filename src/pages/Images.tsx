
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";
import { useEffect } from "react";

const Images = () => {
  const { data: messages = [] } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data } = await supabase
        .from("d1messages")
        .select("message_id, message_name");
      return data || [];
    },
  });

  const messageOptions = messages.map(message => ({
    value: message.message_id,
    label: message.message_name
  }));

  const imageFormatOptions = [
    { value: "Graphic", label: "Graphic" },
    { value: "POV", label: "POV" }
  ];

  const aspectRatioOptions = [
    { value: "1:1", label: "1:1" },
    { value: "4:5", label: "4:5" },
    { value: "9:16", label: "9:16" },
    { value: "16:9", label: "16:9" },
    { value: "21:11", label: "21:11" }
  ];

  const statusOptions = [
    { value: "Generated", label: "Generated" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Archived", label: "Archived" }
  ];

  const columns: ColumnDef[] = [
    {
      field: "image_storage",
      header: "Image",
      inputMode: "text",
      editable: true,
      required: true,
      format: "image"
    },
    {
      field: "message_id",
      header: "Message",
      inputMode: "select",
      editable: true,
      required: true,
      options: messageOptions,
      displayField: "message_name"
    },
    {
      field: "image_format",
      header: "Format",
      inputMode: "select",
      editable: true,
      required: true,
      options: imageFormatOptions
    },
    {
      field: "image_aspectratio",
      header: "Aspect Ratio",
      inputMode: "select",
      editable: true,
      required: true,
      options: aspectRatioOptions
    },
    {
      field: "image_style",
      header: "Style",
      inputMode: "text",
      editable: true,
      required: false
    },
    {
      field: "image_model",
      header: "Model",
      inputMode: "text",
      editable: true,
      required: false
    },
    {
      field: "image_inputprompt",
      header: "Input Prompt",
      inputMode: "text",
      editable: true,
      required: false
    },
    {
      field: "image_magicprompt",
      header: "Magic Prompt",
      inputMode: "text",
      editable: true,
      required: false
    },
    {
      field: "image_status",
      header: "Status",
      inputMode: "select",
      editable: true,
      required: true,
      options: statusOptions
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
    queryKey: ["images"],
    queryFn: async () => {
      const { data } = await supabase
        .from("e1images")
        .select(`
          id:image_id,
          image_storage,
          message_id,
          message:d1messages(message_name),
          image_format,
          image_aspectratio,
          image_style,
          image_model,
          image_inputprompt,
          image_magicprompt,
          image_status,
          created_at
        `);
      
      return (data || []).map(row => ({
        id: row.id,
        image_storage: row.image_storage,
        message_id: row.message_id,
        message_name: row.message?.message_name,
        image_format: row.image_format,
        image_aspectratio: row.image_aspectratio,
        image_style: row.image_style,
        image_model: row.image_model,
        image_inputprompt: row.image_inputprompt,
        image_magicprompt: row.image_magicprompt,
        image_status: row.image_status,
        created_at: row.created_at
      }));
    },
  });

  useEffect(() => {
    // Subscribe to changes on the images table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'e1images'
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
          tableName="e1images" 
          idField="image_id" 
        />,
      }}
    </QuadrantLayout>
  );
};

export default Images;

