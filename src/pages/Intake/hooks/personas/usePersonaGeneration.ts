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

    setIsGeneratingPersonas(true);
    setPersonas([]);
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

      const personasData = data.personas || data.customer_personas;
      
      if (personasData && Array.isArray(personasData)) {
        const enhancedPersonas = personasData.map((persona: Persona) => {
          if (!persona.race) {
            const randomRace = getRandomRace();
            persona.race = randomRace;
          }
          
          let enhancedTitle = persona.title;
          if (persona.interests && persona.interests.length > 0) {
            const primaryInterest = persona.interests[0];
            
            if (!enhancedTitle.toLowerCase().includes(primaryInterest.toLowerCase())) {
              const interestWords = primaryInterest.split(' ');
              const interestWord = interestWords[0];
              
              const creativeAdjectives = [
                "Passionate", "Dedicated", "Enthusiastic", "Devoted", "Avid",
                "Expert", "Savvy", "Inspired", "Innovative", "Trendy"
              ];
              const creativeNouns = [
                "Enthusiast", "Aficionado", "Devotee", "Maven", "Explorer",
                "Connoisseur", "Guru", "Pioneer", "Advocate", "Specialist"
              ];
              
              const randomAdjective = creativeAdjectives[Math.floor(Math.random() * creativeAdjectives.length)];
              const randomNoun = creativeNouns[Math.floor(Math.random() * creativeNouns.length)];
              
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
        
        const newSummary = generatePersonaSummary(offering, enhancedPersonas);
        setSummary(newSummary);
        
        toast.success("Personas generated successfully");
        
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

  const regenerateSinglePersona = async (index: number, offering: string, selectedCountry: string): Promise<Persona | null> => {
    if (!offering) {
      toast.error("Please enter an offering first");
      return null;
    }

    try {
      console.log(`Regenerating persona at index ${index} for product: ${offering}`);
      
      const { data, error } = await supabase.functions.invoke('generate-personas', {
        body: { 
          product: offering || "ramen noodles",
          country: selectedCountry || undefined,
          count: 1
        }
      });

      console.log("Response from generate-personas for single regeneration:", data, error);

      if (error) {
        console.error("Error generating single persona:", error);
        toast.error("Failed to regenerate persona: " + error.message);
        return null;
      }

      if (!data) {
        console.error("No data received from generate-personas");
        toast.error("No data received from the server");
        return null;
      }

      const personasData = data.personas || data.customer_personas;
      
      if (personasData && Array.isArray(personasData) && personasData.length > 0) {
        let newPersona = personasData[0];
        
        if (!newPersona.race) {
          const randomRace = getRandomRace();
          newPersona.race = randomRace;
        }
        
        let enhancedTitle = newPersona.title;
        if (newPersona.interests && newPersona.interests.length > 0) {
          const primaryInterest = newPersona.interests[0];
          
          if (!enhancedTitle.toLowerCase().includes(primaryInterest.toLowerCase())) {
            const interestWords = primaryInterest.split(' ');
            const interestWord = interestWords[0];
            
            const creativeAdjectives = [
              "Passionate", "Dedicated", "Enthusiastic", "Devoted", "Avid",
              "Expert", "Savvy", "Inspired", "Innovative", "Trendy"
            ];
            const creativeNouns = [
              "Enthusiast", "Aficionado", "Devotee", "Maven", "Explorer",
              "Connoisseur", "Guru", "Pioneer", "Advocate", "Specialist"
            ];
            
            const randomAdjective = creativeAdjectives[Math.floor(Math.random() * creativeAdjectives.length)];
            const randomNoun = creativeNouns[Math.floor(Math.random() * creativeNouns.length)];
            
            enhancedTitle = `${interestWord} ${randomAdjective} ${randomNoun}`;
          }
        }
        
        const enhancedPersona: Persona = {
          ...newPersona,
          gender: normalizeGender(newPersona.gender),
          title: enhancedTitle
        };
        
        console.log("Generated single persona with enhanced title:", enhancedPersona);
        
        setPersonas(prevPersonas => {
          const newPersonas = [...prevPersonas];
          newPersonas[index] = enhancedPersona;
          return newPersonas;
        });
        
        toast.success("Persona regenerated successfully");
        
        return enhancedPersona;
      } else {
        console.error("Invalid persona data format received:", data);
        toast.error("Invalid data format received from server");
        return null;
      }
    } catch (err) {
      console.error("Error regenerating persona:", err);
      toast.error("Something went wrong: " + (err instanceof Error ? err.message : String(err)));
      return null;
    }
  };

  const updatePersona = (index: number, updatedPersona: Persona) => {
    setPersonas(prevPersonas => {
      const newPersonas = [...prevPersonas];
      newPersonas[index] = updatedPersona;
      return newPersonas;
    });
  };

  const getRandomRace = (): string => {
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
    updatePersona,
    regenerateSinglePersona
  };
};
