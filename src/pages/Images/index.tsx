
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { getColumns } from "./columns";
import { toast } from "sonner";

const Images = () => {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

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
          image_resolution,
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
        image_resolution: row.image_resolution,
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

  const handleCreateImage = async (newRecord: any) => {
    try {
      toast.loading('Generating images...');
      
      const { data: imageData, error: functionError } = await supabase.functions.invoke('generate-images', {
        body: {
          image_resolution: newRecord.image_resolution,
          image_inputprompt: newRecord.image_inputprompt
        }
      });

      if (functionError || imageData?.error) {
        console.error('Error generating images:', functionError || imageData?.error);
        toast.error('Failed to generate images');
        return;
      }

      if (imageData?.images) {
        setGeneratedImages(imageData.images.map((img: any) => img.url));
        toast.success('Images generated successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate images');
    }
  };

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="space-y-8">
            <SharedTable 
              data={data} 
              columns={getColumns(messageOptions)} 
              tableName="e1images" 
              idField="image_id"
              onAdd={handleCreateImage}
            />
            
            {generatedImages.length > 0 && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Generated Images</h3>
                <div className="grid grid-cols-3 gap-4">
                  {generatedImages.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img 
                        src={url} 
                        alt={`Generated ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Images;
