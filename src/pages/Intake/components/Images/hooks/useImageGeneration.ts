
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateRandomPhrase, getRandomApprovedStyle } from "../utils/imageGenerationUtils";
import { Persona } from "../../Personas/types";

interface UseImageGenerationProps {
  currentPersona: Persona | null;
  adPlatform: string | null;
  toast: any;
}

export const useImageGeneration = ({ currentPersona, adPlatform, toast }: UseImageGenerationProps) => {
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [styleSource, setStyleSource] = useState<string>("database");
  
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
  
  const handleGeneratePrompt = async () => {
    if (!currentPersona) return;
    
    setIsGeneratingPrompt(true);
    
    try {
      const style = await getRandomApprovedStyle();
      const dbResult = await supabase
        .from('y1styles')
        .select('style_name')
        .eq('style_status', 'Approved');
        
      // Update style source for debugging purposes
      if (dbResult.error || !dbResult.data || dbResult.data.length === 0) {
        setStyleSource("default");
      } else {
        setStyleSource("database");
      }
      
      const phrase = generateRandomPhrase();
      const demographics = `${currentPersona.gender}, ${currentPersona.ageMin}-${currentPersona.ageMax}`;
      
      const prompt = `Style: ${style}\nSubject: ${demographics}\nMessage: '${phrase}'${currentPersona.interests ? `\nThemes: ${currentPersona.interests.join(", ")}` : ""}`;
      
      setGeneratedPrompt(prompt);
      
      toast({
        title: "Prompt Generated",
        description: "Image prompt has been created.",
      });
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Prompt Generation Failed",
        description: "Failed to generate image prompt.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };
  
  const handleGenerateImages = async () => {
    if (!currentPersona || !adPlatform) return;
    
    setIsGeneratingImages(true);
    setGeneratedImageUrl(null);
    setErrorDetails(null);
    
    try {
      let prompt = generatedPrompt;
      if (!prompt) {
        const style = await getRandomApprovedStyle();
        const phrase = generateRandomPhrase();
        const demographics = `${currentPersona.gender}, ${currentPersona.ageMin}-${currentPersona.ageMax}`;
        
        prompt = `Style: ${style}\nSubject: ${demographics}\nMessage: '${phrase}'${currentPersona.interests ? `\nThemes: ${currentPersona.interests.join(", ")}` : ""}`;
      }

      console.log("Image generation prompt:", prompt);
      
      const platformResolutions = getResolutionsForPlatform();
      const resolution = platformResolutions.length > 0 ? platformResolutions[0].value : "RESOLUTION_1024_1024";

      const { data, error } = await supabase.functions.invoke('generate-persona-image', {
        body: { 
          prompt, 
          resolution 
        }
      });
      
      console.log('Image generation response:', { data, error });
      
      if (error) {
        const errorMessage = error.message || "Failed to generate image";
        console.error('Error calling edge function:', errorMessage);
        setErrorDetails(`Edge Function Error: ${errorMessage}`);
        setShowErrorDialog(true);
        throw new Error(errorMessage);
      }
      
      if (data && data.success && data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        toast({
          title: "Image Generated",
          description: "Image has been successfully generated.",
        });
      } else {
        const errorMsg = data?.error || "Unknown error occurred";
        const details = data?.details ? JSON.stringify(data.details, null, 2) : "No details available";
        const fullError = `Error: ${errorMsg}\n\nDetails: ${details}`;
        console.error('Error generating image:', fullError);
        setErrorDetails(fullError);
        setShowErrorDialog(true);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Exception in image generation:', error);
      
      if (!errorDetails) {
        setErrorDetails(`Error: ${error.message || "Unknown error"}`);
      }
      
      toast({
        title: "Generation Failed",
        description: "Click 'View Details' for more information.",
        variant: "destructive",
        action: (
          <Button onClick={() => setShowErrorDialog(true)} variant="outline" size="sm">
            View Details
          </Button>
        )
      });
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return {
    isGeneratingImages,
    isGeneratingPrompt,
    generatedImageUrl,
    generatedPrompt,
    errorDetails,
    showErrorDialog,
    styleSource,
    handleGeneratePrompt,
    handleGenerateImages,
    setGeneratedPrompt,
    setShowErrorDialog
  };
};
