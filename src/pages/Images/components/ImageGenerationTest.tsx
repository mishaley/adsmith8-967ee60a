
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ImageGenerationTest = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleRunImageGeneration = async () => {
    setIsLoading(true);
    setGeneratedImageUrl(null);
    
    try {
      // Using a default prompt for the test
      const prompt = "A beautiful landscape with mountains and a lake at sunset";
      
      const response = await supabase.functions.invoke('ideogram-test', {
        body: { prompt }
      });
      
      if (response.error) {
        toast({
          title: "Image Generation Failed",
          description: `Error: ${response.error.message || 'Unknown error'}`,
          variant: "destructive",
        });
        console.error('API test error:', response.error);
        return;
      }
      
      const data = response.data;
      console.log('Ideogram API response:', data);
      
      if (data.success) {
        if (data.imageUrl) {
          setGeneratedImageUrl(data.imageUrl);
          toast({
            title: "Image Generated Successfully",
            description: "The test image has been generated.",
          });
        } 
        else if (data.data && data.data.length > 0 && data.data[0].url) {
          setGeneratedImageUrl(data.data[0].url);
          toast({
            title: "Image Generated Successfully",
            description: "The test image has been generated.",
          });
        } else {
          toast({
            title: "API Connection Successful",
            description: "API connected but no image URL was found. Check the logs for details.",
          });
        }
      } else {
        toast({
          title: "Image Generation Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
        console.error('API test details:', data.details);
      }
    } catch (error) {
      toast({
        title: "Image Generation Failed",
        description: `Error: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
      console.error('Generate image error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/2 border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">AI image generation test</h3>
        <Button 
          onClick={handleRunImageGeneration} 
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {isLoading ? "Running..." : "Run"}
        </Button>
      </div>
      <div className="text-sm text-gray-500 mb-4">
        Tests connection to the Ideogram API with your credentials.
      </div>
      
      {generatedImageUrl && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <img 
            src={generatedImageUrl} 
            alt="Generated test image" 
            className="w-full h-auto object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ImageGenerationTest;
