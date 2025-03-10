
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../types";
import { createPortraitPrompt } from "../utils/portraitUtils";

// Function to generate a portrait for a persona using the Supabase Edge Function
export const generatePersonaPortrait = async (persona: Persona, customPrompt?: string) => {
  if (!persona || !persona.title) {
    console.error("Invalid persona data for portrait generation");
    return { error: "Invalid persona data" };
  }

  try {
    console.log(`Generating portrait for persona: ${persona.title}`);
    
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
      customPrompt: prompt // Pass the custom or generated prompt
    };

    console.log("Portrait generation request data:", JSON.stringify(personaData, null, 2));

    // Call the Supabase Edge Function to generate the portrait
    const { data, error } = await supabase.functions.invoke('generate-persona-image', {
      body: personaData
    });

    if (error) {
      console.error("Error generating portrait:", error);
      return { error: error.message || "Failed to generate portrait" };
    }

    console.log("Portrait generation response:", data);

    if (!data || !data.success) {
      const errorMessage = data?.error || "No image was generated";
      console.error("Error in portrait generation:", errorMessage);
      return { error: errorMessage };
    }

    console.log(`Portrait generated successfully for ${persona.title}`);
    return { imageUrl: data.image_url };

  } catch (err) {
    console.error("Exception in portrait generation:", err);
    return { error: err instanceof Error ? err.message : String(err) };
  }
};
