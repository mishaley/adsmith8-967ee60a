
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../../../components/Personas/types";
import { normalizeGender, ensureTwoInterests } from "../../../utils/personaUtils";
import { getRandomRace } from "../utils/personaGenerationUtils";

/**
 * Generate multiple personas through the Supabase function
 */
export const generatePersonasApi = async (offering: string, selectedCountry: string, count?: number) => {
  // Try to fetch organization details
  let organizationData = {
    name: "",
    industry: ""
  };
  
  try {
    // Get organization ID from localStorage
    const orgId = localStorage.getItem("selectedOrganizationId");
    if (orgId) {
      const { data: orgData } = await supabase
        .from("a1organizations")
        .select("organization_name, organization_industry")
        .eq("organization_id", orgId)
        .single();
      
      if (orgData) {
        organizationData = {
          name: orgData.organization_name || "",
          industry: orgData.organization_industry || ""
        };
      }
    }
  } catch (error) {
    console.warn("Could not fetch organization details:", error);
  }
  
  // Try to fetch offering details
  let offeringData = {
    name: offering,
    keySellingPoints: "",
    problemSolved: "",
    uniqueAdvantages: ""
  };
  
  try {
    // Get offering ID from localStorage
    const offeringId = localStorage.getItem("offering_selectedId");
    if (offeringId && offeringId !== "new-offering") {
      const { data: offeringDetails } = await supabase
        .from("b1offerings")
        .select("offering_name, offering_keysellingpoints, offering_problemsolved, offering_uniqueadvantages")
        .eq("offering_id", offeringId)
        .single();
      
      if (offeringDetails) {
        offeringData = {
          name: offeringDetails.offering_name || offering,
          keySellingPoints: offeringDetails.offering_keysellingpoints || "",
          problemSolved: offeringDetails.offering_problemsolved || "",
          uniqueAdvantages: offeringDetails.offering_uniqueadvantages || ""
        };
      }
    }
  } catch (error) {
    console.warn("Could not fetch offering details:", error);
  }
  
  // Validate count to ensure it's a positive number
  const validCount = Math.max(1, Math.min(5, count || 1));
  
  const { data, error } = await supabase.functions.invoke('generate-personas', {
    body: { 
      product: offering || "ramen noodles",
      country: selectedCountry || undefined,
      count: validCount,
      organization: organizationData,
      offering: offeringData
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
  return personasData.map((persona: Persona, index: number) => {
    if (!persona.race) {
      const randomRace = getRandomRace();
      persona.race = randomRace;
    }
    
    // Generate a title if one doesn't exist
    if (!persona.title) {
      const titles = [
        "Enthusiastic Explorer",
        "Loyal Customer",
        "Discerning Buyer",
        "Trendy Consumer",
        "Value Seeker"
      ];
      persona.title = titles[index % titles.length];
    }
    
    // Add description if missing
    if (!persona.description) {
      persona.description = `A ${persona.ageMin}-${persona.ageMax} year old ${persona.gender.toLowerCase()} interested in ${persona.interests.join(" and ")}.`;
    }
    
    // Ensure each persona has an ID
    if (!persona.id) {
      persona.id = `persona-${index}`;
    }
    
    // Ensure each persona has exactly two relevant interests
    const enhancedInterests = ensureTwoInterests(persona.interests || [], offering);
    
    // Convert string age values to numbers
    const ageMin = typeof persona.ageMin === 'string' ? parseInt(persona.ageMin, 10) : (persona.ageMin || 0);
    const ageMax = typeof persona.ageMax === 'string' ? parseInt(persona.ageMax, 10) : (persona.ageMax || 0);
    
    return {
      ...persona,
      gender: normalizeGender(persona.gender || ''), // Ensure gender is never empty
      interests: enhancedInterests, // This is now guaranteed to be a non-empty array
      ageMin,
      ageMax
    };
  });
};

