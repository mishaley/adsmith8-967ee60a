
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../types";
import { createPortraitPrompt } from "../utils/portraitUtils";
import { logInfo, logError } from "@/utils/logging";

// Function to generate a portrait for a persona using the Supabase Edge Function
export const generatePersonaPortrait = async (persona: Persona, customPrompt?: string) => {
  if (!persona || !persona.title) {
    logError("Invalid persona data for portrait generation");
    return { error: "Invalid persona data" };
  }

  try {
    // Create a prompt if not provided
    const prompt = customPrompt || createPortraitPrompt(persona);
    
    // Prepare persona data for the API call
    const personaData = {
      name: persona.title,
      gender: persona.gender || '',
      age: persona.age || '',
      ageMin: persona.ageMin !== undefined ? persona.ageMin.toString() : '',
      ageMax: persona.ageMax !== undefined ? persona.ageMax.toString() : '',
      occupation: persona.occupation || '',
      interests: persona.interests || [],
      race: persona.race || '',
      prompt,
    };

    // Call the Supabase Edge Function to generate the portrait
    const { data, error } = await supabase.functions.invoke('generate-persona-image', {
      body: personaData
    });

    if (error) {
      logError("Error generating portrait:", error);
      return { error: error.message || "Failed to generate portrait" };
    }

    if (!data || !data.success) {
      const errorMessage = data?.error || "No image was generated";
      logError("Error in portrait generation:", errorMessage);
      return { error: errorMessage };
    }

    return { imageUrl: data.imageUrls };

  } catch (err) {
    logError("Exception in portrait generation:", err);
    return { error: err instanceof Error ? err.message : String(err) };
  }
};
