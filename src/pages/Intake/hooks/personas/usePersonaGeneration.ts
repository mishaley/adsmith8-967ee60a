
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../../components/Personas/types";
import { generatePersonaSummary, normalizeGender } from "../../utils/personaUtils";

export const usePersonaGeneration = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);
  const [summary, setSummary] = useState("");

  const generatePersonas = async (offering: string, selectedCountry: string, onPersonasGenerated: (personas: Persona[]) => void) => {
    if (!offering) {
      toast.error("Please enter an offering first");
      return;
    }

    // Reset states
    setIsGeneratingPersonas(true);
    setPersonas([]); // Clear existing personas to show we're starting fresh
    setSummary("");
    
    try {
      console.log("Calling generate-personas with product:", offering);
      
      const { data, error } = await supabase.functions.invoke('generate-personas', {
        body: { 
          product: offering || "ramen noodles",
          country: selectedCountry || undefined
        }
      });

      console.log("Response from generate-personas:", data, error);

      if (error) {
        console.error("Error generating personas:", error);
        toast.error("Failed to generate personas: " + error.message);
        return;
      }

      if (!data) {
        console.error("No data received from generate-personas");
        toast.error("No data received from the server");
        return;
      }

      // Check for the correct personas data structure
      const personasData = data.personas || data.customer_personas;
      
      if (personasData && Array.isArray(personasData)) {
        // Normalize gender values and enhance titles based on interests
        const enhancedPersonas = personasData.map((persona: Persona) => {
          // Ensure persona has a race property
          if (!persona.race) {
            const randomRace = getRandomRace();
            persona.race = randomRace;
          }
          
          // Create a more creative title based on interests if possible
          let enhancedTitle = persona.title;
          if (persona.interests && persona.interests.length > 0) {
            // Try to incorporate an interest into the title if it's not already part of it
            const primaryInterest = persona.interests[0];
            
            // Only modify if the title doesn't already mention the interest
            if (!enhancedTitle.toLowerCase().includes(primaryInterest.toLowerCase())) {
              // Create more creative three-word titles that incorporate interests
              // Examples: "Tech-Savvy Explorer", "Fitness Lifestyle Enthusiast", "Creative Writing Maven"
              
              const interestWords = primaryInterest.split(' ');
              const interestWord = interestWords[0]; // Use the first word of the interest
              
              // Selection of creative adjectives and nouns based on interests
              const creativeAdjectives = [
                "Passionate", "Dedicated", "Enthusiastic", "Devoted", "Avid",
                "Expert", "Savvy", "Inspired", "Innovative", "Trendy"
              ];
              const creativeNouns = [
                "Enthusiast", "Aficionado", "Devotee", "Maven", "Explorer",
                "Connoisseur", "Guru", "Pioneer", "Advocate", "Specialist"
              ];
              
              // Randomly select an adjective and noun
              const randomAdjective = creativeAdjectives[Math.floor(Math.random() * creativeAdjectives.length)];
              const randomNoun = creativeNouns[Math.floor(Math.random() * creativeNouns.length)];
              
              // Create a three-word title incorporating the interest
              enhancedTitle = `${interestWord} ${randomAdjective} ${randomNoun}`;
            }
          }
          
          return {
            ...persona,
            gender: normalizeGender(persona.gender),
            title: enhancedTitle
          };
        });
        
        console.log("Generated personas with enhanced titles:", enhancedPersonas);
        setPersonas(enhancedPersonas);
        
        // Generate a summary with enhanced personas
        const newSummary = generatePersonaSummary(offering, enhancedPersonas);
        setSummary(newSummary);
        
        toast.success("Personas generated successfully");
        
        // Call the callback to notify parent
        onPersonasGenerated(enhancedPersonas);
      } else {
        console.error("Invalid personas data format received:", data);
        toast.error("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGeneratingPersonas(false);
    }
  };

  const updatePersona = (index: number, updatedPersona: Persona) => {
    setPersonas(prevPersonas => {
      const newPersonas = [...prevPersonas];
      newPersonas[index] = updatedPersona;
      return newPersonas;
    });
  };

  // Import the getRandomRace function inline to avoid circular dependencies
  const getRandomRace = (): string => {
    // Race distribution as specified
    const RACE_DISTRIBUTION = [
      "White", "White", "White", "Latino", "Latino", 
      "Black", "Black", "Asian", "Indian-American", "Biracial"
    ];
    
    const randomIndex = Math.floor(Math.random() * RACE_DISTRIBUTION.length);
    return RACE_DISTRIBUTION[randomIndex];
  };

  return {
    personas,
    summary,
    isGeneratingPersonas,
    generatePersonas,
    updatePersona
  };
};
