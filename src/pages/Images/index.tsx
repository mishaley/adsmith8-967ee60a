
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Images = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGenerateImage = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image');
      
      if (error) {
        throw error;
      }

      if (data.image_url) {
        setGeneratedImage(data.image_url);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            />
            <div className="bg-[#F6F6F7] rounded-lg p-6 shadow-sm" style={{ height: '300px', width: '1000px' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#403E43]">Ideogram test</h2>
                <Button 
                  variant="default" 
                  onClick={handleGenerateImage}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Run'}
                </Button>
              </div>
              <div className="flex items-center justify-center h-[200px]">
                {generatedImage && (
                  <img 
                    src={generatedImage} 
                    alt="Generated image"
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                )}
              </div>
            </div>
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Images;
