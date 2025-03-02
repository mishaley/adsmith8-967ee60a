
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../../../components/Personas/types";
import { normalizeGender } from "../../../utils/personaUtils";
import { getRandomRace, enhancePersonaTitle } from "../utils/personaGenerationUtils";

/**
 * Generate multiple personas through the Supabase function
 */
export const generatePersonasApi = async (offering: string, selectedCountry: string, count?: number) => {
  console.log(`Calling generate-personas with product: ${offering}${count ? `, count: ${count}` : ''}`);
  
  const { data, error } = await supabase.functions.invoke('generate-personas', {
    body: { 
      product: offering || "ramen noodles",
      country: selectedCountry || undefined,
      count: count
    }
  });

  console.log("Response from generate-personas:", data, error);

  if (error) {
    console.error("Error generating personas:", error);
    throw new Error("Failed to generate personas: " + error.message);
  }

  if (!data) {
    console.error("No data received from generate-personas");
    throw new Error("No data received from the server");
  }

  const personasData = data.personas || data.customer_personas;
  
  if (!personasData || !Array.isArray(personasData)) {
    console.error("Invalid personas data format received:", data);
    throw new Error("Invalid data format received from server");
  }

  return enhancePersonas(personasData);
};

/**
 * Enhance raw personas data with additional information
 */
const enhancePersonas = (personasData: Persona[]): Persona[] => {
  return personasData.map((persona: Persona) => {
    if (!persona.race) {
      const randomRace = getRandomRace();
      persona.race = randomRace;
    }
    
    const enhancedTitle = enhancePersonaTitle(persona.title, persona.interests);
    
    return {
      ...persona,
      gender: normalizeGender(persona.gender),
      title: enhancedTitle
    };
  });
};
