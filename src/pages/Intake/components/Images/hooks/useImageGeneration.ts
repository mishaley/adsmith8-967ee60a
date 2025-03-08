import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateRandomPhrase, getRandomApprovedStyle } from "../utils/imageGenerationUtils";
import { Persona } from "../../Personas/types";
import { getRandomRace } from "../../Personas/utils/portraitUtils";

interface UseImageGenerationProps {
  currentPersona: Persona | null;
  adPlatform: string | null;
  toast: any;
  offering?: string;
}

export const useImageGeneration = ({ currentPersona, adPlatform, toast, offering = "" }: UseImageGenerationProps) => {
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  
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
    setErrorDetails(null);
    
    try {
      console.log("Starting prompt generation process...");
      const style = await getRandomApprovedStyle();
      console.log("Successfully retrieved style:", style);
      
      const message = currentPersona.title || generateRandomPhrase();
      const race = getRandomRace();
      const gender = currentPersona.gender === "Men" ? "Man" : 
                     currentPersona.gender === "Women" ? "Woman" : 
                     currentPersona.gender;
      
      const interests = currentPersona.interests || [];
      const interest1 = interests.length > 0 ? interests[0] : "Urban style";
      const interest2 = interests.length > 1 ? interests[1] : "Fashion";
      
      const ageRange = (currentPersona.ageMin && currentPersona.ageMax) 
        ? `${currentPersona.ageMin}-${currentPersona.ageMax}` 
        : currentPersona.age || "25-35";
      
      const prompt = `Style: ${style}\nMessage: '${message}'\nThemes: ${offering}, ${interest1}, ${interest2}\nModel: ${race} ${gender}, age ${ageRange}`;
      
      setGeneratedPrompt(prompt);
      
      toast({
        title: "Prompt Generated",
        description: "Image prompt has been created.",
      });
    } catch (error) {
      console.error('Error generating prompt:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error message:', errorMessage);
      
      toast({
        title: "Prompt Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      setErrorDetails(`Failed to generate prompt: ${errorMessage}`);
      setShowErrorDialog(true);
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
        console.log("No prompt available, generating a new one...");
        const style = await getRandomApprovedStyle();
        const race = getRandomRace();
        const gender = currentPersona.gender === "Men" ? "Man" : 
                       currentPersona.gender === "Women" ? "Woman" : 
                       currentPersona.gender;
        
        const interests = currentPersona.interests || [];
        const interest1 = interests.length > 0 ? interests[0] : "Urban style";
        const interest2 = interests.length > 1 ? interests[1] : "Fashion";
        
        const ageRange = (currentPersona.ageMin && currentPersona.ageMax) 
          ? `${currentPersona.ageMin}-${currentPersona.ageMax}` 
          : currentPersona.age || "25-35";
        
        prompt = `Style: ${style}\nMessage: '${currentPersona.title || generateRandomPhrase()}'\nThemes: ${offering}, ${interest1}, ${interest2}\nModel: ${race} ${gender}, age ${ageRange}`;
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
        setErrorDetails(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
      
      toast({
        title: "Generation Failed",
        description: "Click 'View Details' for more information.",
        variant: "destructive",
        action: {
          label: "View Details",
          onClick: () => setShowErrorDialog(true)
        }
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
    handleGeneratePrompt,
    handleGenerateImages,
    setGeneratedPrompt,
    setShowErrorDialog
  };
};
