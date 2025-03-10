
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../../../components/Personas/types";
import { normalizeGender, ensureTwoInterests } from "../../../utils/personaUtils";
import { getRandomRace } from "../utils/personaGenerationUtils";
import { logWarning, logError, logDebug, logInfo } from "@/utils/logging";

/**
 * Validates if a string is a valid UUID
 */
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

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
    const orgId = localStorage.getItem("intake_selectedOrganizationId");
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
    logWarning("Could not fetch organization details:", error);
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
    logWarning("Could not fetch offering details:", error);
  }
  
  // Validate count to ensure it's a positive number
  const validCount = Math.max(1, Math.min(5, count || 1));
  
  logInfo(`Generating ${validCount} personas for offering: ${offering}`);
  
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
    logError("Error generating personas:", error);
    throw new Error("Failed to generate personas: " + error.message);
  }

  if (!data) {
    logError("No data received from the server");
    throw new Error("No data received from the server");
  }

  logInfo("Received response from generate-personas function:", JSON.stringify(data));

  // Improved response handling to work with both formats
  let personasData;
  if (data.personas) {
    // Response is already correctly wrapped
    logInfo("Received correctly formatted personas response with", data.personas.length, "personas");
    personasData = data.personas;
  } else if (data.customer_personas) {
    // Alternative field name
    logInfo("Received personas in customer_personas field");
    personasData = data.customer_personas;
  } else if (Array.isArray(data)) {
    // Direct array response
    logInfo("Received personas as direct array");
    personasData = data;
  } else {
    // Unknown format - log it for debugging
    logError("Unknown personas data format received:", data);
    throw new Error("Invalid data format received from server");
  }
  
  if (!Array.isArray(personasData) || personasData.length === 0) {
    logError("Personas data is not a valid array:", personasData);
    throw new Error("Invalid personas data format or empty array");
  }
  
  logInfo(`Successfully parsed ${personasData.length} personas`);
  const enhancedPersonas = enhancePersonas(personasData, offering);
  logInfo(`Enhanced ${enhancedPersonas.length} personas with additional data`);
  
  return enhancedPersonas;
};

/**
 * Enhance raw personas data with additional information
 */
const enhancePersonas = (personasData: Persona[], offering: string): Persona[] => {
  return personasData.map((persona: Persona, index: number) => {
    // Log the incoming persona data
    logDebug(`Enhancing persona ${index}:`, JSON.stringify(persona));
    
    // Ensure we have valid data and add any missing fields
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
      persona.description = `A ${persona.ageMin}-${persona.ageMax} year old ${persona.gender.toLowerCase()} interested in ${persona.interests ? persona.interests.join(" and ") : "this product"}.`;
    }
    
    // Ensure each persona has an ID that's compatible with Supabase
    // If we have a UUID, use it, otherwise generate a non-UUID synthetic ID
    if (!persona.id) {
      persona.id = `persona-${index}`;
    } else if (typeof persona.id === 'string' && !isValidUUID(persona.id) && persona.id.indexOf('persona-') !== 0) {
      // If it's not a valid UUID and not already in our persona-X format, use our synthetic ID format
      logDebug(`Converting non-UUID persona ID ${persona.id} to synthetic format`);
      persona.id = `persona-${index}`;
    }
    
    // Ensure gender is normalized
    const normalizedGender = normalizeGender(persona.gender || '');
    
    // Ensure each persona has exactly two relevant interests
    const enhancedInterests = ensureTwoInterests(persona.interests || [], offering);
    
    // Convert string age values to numbers
    const ageMin = typeof persona.ageMin === 'string' ? parseInt(persona.ageMin, 10) : (persona.ageMin || 0);
    const ageMax = typeof persona.ageMax === 'string' ? parseInt(persona.ageMax, 10) : (persona.ageMax || 0);
    
    const enhancedPersona = {
      ...persona,
      gender: normalizedGender, // Ensure gender is never empty
      interests: enhancedInterests, // This is now guaranteed to be a non-empty array
      ageMin,
      ageMax
    };
    
    // Log the enhanced persona
    logDebug(`Enhanced persona ${index}:`, JSON.stringify(enhancedPersona));
    
    return enhancedPersona;
  });
};
