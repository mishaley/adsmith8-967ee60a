
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
        // Normalize gender values in the personas
        const normalizedPersonas = personasData.map((persona: Persona) => ({
          ...persona,
          gender: normalizeGender(persona.gender)
        }));
        
        console.log("Generated personas:", normalizedPersonas);
        setPersonas(normalizedPersonas);
        
        // Generate a summary with normalized personas
        const newSummary = generatePersonaSummary(offering, normalizedPersonas);
        setSummary(newSummary);
        
        toast.success("Personas generated successfully");
        
        // Call the callback to notify parent
        onPersonasGenerated(normalizedPersonas);
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

  return {
    personas,
    summary,
    isGeneratingPersonas,
    generatePersonas,
    updatePersona
  };
};
