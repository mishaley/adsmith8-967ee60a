
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../../../components/Personas/types";
import { normalizeGender, ensureTwoInterests } from "../../../utils/personaUtils";
import { getRandomRace } from "../utils/personaGenerationUtils";

/**
 * Generate multiple personas through the Supabase function
 */
export const generatePersonasApi = async (offering: string, selectedCountry: string, count?: number) => {
  const { data, error } = await supabase.functions.invoke('generate-personas', {
    body: { 
      product: offering || "ramen noodles",
      country: selectedCountry || undefined,
      count: count
    }
  });

  if (error) {
    console.error("Error generating personas:", error);
    throw new Error("Failed to generate personas: " + error.message);
  }

  if (!data) {
    throw new Error("No data received from the server");
  }

  const personasData = data.personas || data.customer_personas;
  
  if (!personasData || !Array.isArray(personasData)) {
    console.error("Invalid personas data format received:", data);
    throw new Error("Invalid data format received from server");
  }

  return enhancePersonas(personasData, offering);
};

/**
 * Enhance raw personas data with additional information
 */
const enhancePersonas = (personasData: Persona[], offering: string): Persona[] => {
  return personasData.map((persona: Persona) => {
    if (!persona.race) {
      const randomRace = getRandomRace();
      persona.race = randomRace;
    }
    
    // Ensure each persona has exactly two relevant interests
    const enhancedInterests = ensureTwoInterests(persona.interests || [], offering);
    
    return {
      ...persona,
      gender: normalizeGender(persona.gender),
      interests: enhancedInterests
    };
  });
};
