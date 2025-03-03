
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../../Personas/types";
import { generateRandomPhrase, getRandomApprovedStyle } from "../utils/imageGenerationUtils";

interface ImageGeneratorProps {
  currentPersona: Persona | null;
  adPlatform: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ currentPersona, adPlatform }) => {
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get the appropriate resolution options based on the ad platform
  const getResolutionsForPlatform = () => {
    const platformResolutions = {
      "Google": [
        { label: "1:1", value: "RESOLUTION_1024_1024" },
        { label: "4:5", value: "RESOLUTION_896_1120" },
        { label: "21:11", value: "RESOLUTION_1344_704" }
      ],
      "Meta": [
        { label: "1:1", value: "RESOLUTION_1024_1024" },
        { label: "4:5", value: "RESOLUTION_896_1120" },
        { label: "9:16", value: "RESOLUTION_720_1280" }
      ]
    };
    
    return adPlatform && platformResolutions[adPlatform] ? platformResolutions[adPlatform] : [];
  };
  
  // Handle image generation
  const handleGenerateImages = async () => {
    if (!currentPersona || !adPlatform) return;
    
    setIsGeneratingImages(true);
    setGeneratedImageUrl(null);
    
    try {
      // Get a random approved style
      const style = await getRandomApprovedStyle();
      
      // Generate a random phrase
      const phrase = generateRandomPhrase();
      
      // Prepare demographics text
      const demographics = `${currentPersona.gender}, ${currentPersona.ageMin}-${currentPersona.ageMax}`;
      
      // Create the prompt
      const prompt = `Style: ${style}
Subject: ${demographics}
Message: '${phrase}'
${currentPersona.interests ? `Interests: ${currentPersona.interests.join(", ")}` : ""}`;

      console.log("Image generation prompt:", prompt);
      
      // Determine resolution based on adPlatform
      const platformResolutions = getResolutionsForPlatform();
      const resolution = platformResolutions.length > 0 ? platformResolutions[0].value : "RESOLUTION_1024_1024";

      // Call the Edge function to generate the image
      const response = await supabase.functions.invoke('generate-persona-image', {
        body: { 
          prompt, 
          resolution 
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to generate image");
      }
      
      console.log('Image generation response:', response.data);
      
      if (response.data.success && response.data.imageUrl) {
        setGeneratedImageUrl(response.data.imageUrl);
        toast({
          title: "Image Generated",
          description: "Image has been successfully generated.",
        });
      } else {
        throw new Error(response.data.error || "No image was generated");
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImages(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center min-h-52">
      <div className="mb-4">
        <Button 
          onClick={handleGenerateImages} 
          disabled={isGeneratingImages || !adPlatform}
          className="px-6"
        >
          {isGeneratingImages ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Image className="mr-2 h-4 w-4" />
              Generate Images
            </>
          )}
        </Button>
      </div>
      
      <div className="w-full h-40 bg-gray-50 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
        {generatedImageUrl ? (
          <img 
            src={generatedImageUrl} 
            alt="Generated persona image" 
            className="max-w-full max-h-40 object-contain"
          />
        ) : (
          <span className="text-gray-400">Images will appear here after generation</span>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
