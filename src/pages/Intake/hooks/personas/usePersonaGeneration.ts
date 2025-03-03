import { useState } from "react";
import { toast } from "sonner";
import { Persona } from "../../components/Personas/types";
import { generatePersonaSummary } from "../../utils/personaUtils";
import { generatePersonasApi } from "./services/personaApiService";

export const usePersonaGeneration = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);
  const [summary, setSummary] = useState("");

  /**
   * Generate multiple personas and trigger the provided callback when done
   */
  const generatePersonas = async (
    offering: string, 
    selectedCountry: string,
    count: number = 1,
    onPersonasGenerated: (personas: Persona[]) => void
  ) => {
    if (!offering) {
      toast.error("Please enter an offering first");
      return;
    }

    // Validate count to ensure it's a positive number
    const validCount = Math.max(1, Math.min(5, count));
    console.log(`Generating ${validCount} personas (requested: ${count})`);

    setIsGeneratingPersonas(true);
    setPersonas([]);
    setSummary("");
    
    try {
      // Pass the validated count to the API
      const enhancedPersonas = await generatePersonasApi(offering, selectedCountry, validCount);
      
      console.log(`Generated ${enhancedPersonas.length} personas with enhanced titles:`, enhancedPersonas);
      
      // Only set the personas that match the requested count
      setPersonas(enhancedPersonas.slice(0, validCount));
      
      const newSummary = generatePersonaSummary(offering, enhancedPersonas.slice(0, validCount));
      setSummary(newSummary);
      
      toast.success(`${validCount} persona${validCount > 1 ? 's' : ''} generated successfully`);
      
      // Only pass the personas that match the requested count to the callback
      onPersonasGenerated(enhancedPersonas.slice(0, validCount));
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGeneratingPersonas(false);
    }
  };

  /**
   * Regenerate a single persona at the specified index
   */
  const regenerateSinglePersona = async (
    index: number, 
    offering: string, 
    selectedCountry: string
  ): Promise<Persona | null> => {
    if (!offering) {
      toast.error("Please enter an offering first");
      return null;
    }

    try {
      console.log(`Regenerating persona at index ${index} for product: ${offering}`);
      
      const enhancedPersonas = await generatePersonasApi(offering, selectedCountry, 1);
      
      if (enhancedPersonas && enhancedPersonas.length > 0) {
        const newPersona = enhancedPersonas[0];
        
        console.log("Generated single persona with enhanced title:", newPersona);
        
        setPersonas(prevPersonas => {
          const newPersonas = [...prevPersonas];
          newPersonas[index] = newPersona;
          return newPersonas;
        });
        
        toast.success("Persona regenerated successfully");
        
        return newPersona;
      }
      
      return null;
    } catch (err) {
      console.error("Error regenerating persona:", err);
      toast.error("Something went wrong: " + (err instanceof Error ? err.message : String(err)));
      return null;
    }
  };

  /**
   * Update a persona at the specified index
   */
  const updatePersona = (index: number, updatedPersona: Persona) => {
    setPersonas(prevPersonas => {
      const newPersonas = [...prevPersonas];
      newPersonas[index] = updatedPersona;
      return newPersonas;
    });
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
