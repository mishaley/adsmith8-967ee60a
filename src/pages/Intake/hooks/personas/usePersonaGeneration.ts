import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Persona } from "../../components/Personas/types";
import { generatePersonaSummary } from "../../utils/personaUtils";
import { generatePersonasApi } from "./services/personaApiService";
import { logDebug, logError, logInfo } from "@/utils/logging";
import { supabase } from "@/integrations/supabase/client";

export const usePersonaGeneration = (selectedOfferingId: string) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);
  const [summary, setSummary] = useState("");

  // const fetchPersonasFromSupabase = async (offeringId) => {
  //   if (!offeringId) return;

  //   try {
  //     logInfo(`Fetching personas for offering_id: ${offeringId}`);
  //     const { data, error } = await supabase
  //       .from("c1personas")
  //       .select("*")
  //       .eq("offering_id", offeringId);

  //     if (error) throw error;
  //     if (!data || data.length === 0) {
  //       toast.error("No personas found for this offering.");
  //       setPersonas([]);
  //       return;
  //     }

  //     logInfo(`Fetched ${data.length} personas from Supabase`);
  //     setPersonas(data as any);
  //     setSummary(generatePersonaSummary(offeringId, data as any));
  //   } catch (err) {
  //     logError("Error fetching personas from Supabase:", err);
  //     setPersonas([]);
  //   }
  // };
  // console.log({ selectedOfferingId });

  // useEffect(() => {
  //   if (selectedOfferingId) {
  //     fetchPersonasFromSupabase(selectedOfferingId);
  //   }
  // }, [selectedOfferingId]);

  const insertPersonasToSupabase = async (personas: any) => {
    try {
      const { data, error } = await supabase
        .from("c1personas")
        .insert(personas);
      if (error) {
        throw error;
      }
      console.log({ error });
      logInfo("Personas successfully inserted into Supabase:", data);
    } catch (err) {
      console.log({ err });

      logError("Failed to insert personas into Supabase:", err);
    }
  };

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

    logInfo(
      `Starting persona generation for "${offering}" with count ${validCount}`
    );
    setIsGeneratingPersonas(true);
    setPersonas([]);
    setSummary("");

    try {
      // Pass the validated count to the API
      const enhancedPersonas = await generatePersonasApi(
        offering,
        selectedCountry,
        validCount
      );

      logInfo(`API returned ${enhancedPersonas?.length || 0} personas`);

      if (!enhancedPersonas || enhancedPersonas.length === 0) {
        throw new Error("No personas were returned from the API");
      }

      // Convert string ageMin/ageMax values to numbers if needed before setting state
      const normalizedPersonas = enhancedPersonas.map((persona, index) => {
        logDebug(`Processing persona ${index} for state update`);
        return {
          ...persona,
          ageMin:
            typeof persona.ageMin === "string"
              ? parseInt(persona.ageMin, 10)
              : persona.ageMin,
          ageMax:
            typeof persona.ageMax === "string"
              ? parseInt(persona.ageMax, 10)
              : persona.ageMax,
          // Ensure interests is an array
          interests: Array.isArray(persona.interests)
            ? persona.interests
            : persona.interests
            ? typeof persona.interests === "string"
              ? [persona.interests]
              : [String(persona.interests)]
            : ["Product offering", "Services"],
        };
      });

      logInfo(
        `Normalized ${normalizedPersonas.length} personas for state update`
      );

      // Only set the personas that match the requested count
      const finalPersonas = normalizedPersonas.slice(0, validCount);
      const offeringId = localStorage.getItem("adsmith_offering_selectedId");
      console.log({ finalPersonas });
      const updatedPersona = normalizedPersonas.map((persona, index) => {
        return {
          persona_name: `GenPop-${offeringId}`,
          offering_id: offeringId || "",
          persona_gender: persona.gender,
          persona_agemin: persona.ageMin,
          persona_agemax: persona.ageMax,
          persona_interests: persona.interests,
        };
      });

      logInfo(`Setting ${finalPersonas.length} personas to state`);
      insertPersonasToSupabase(updatedPersona);
      // Important: Set the personas to state
      setPersonas(finalPersonas);

      const newSummary = generatePersonaSummary(offering, finalPersonas);
      setSummary(newSummary);

      toast.success(
        `${validCount} persona${
          validCount > 1 ? "s" : ""
        } generated successfully`
      );

      // Only pass the personas that match the requested count to the callback
      onPersonasGenerated(finalPersonas);
    } catch (err) {
      logError("Error generating personas:", err);
      toast.error(
        "Something went wrong: " +
          (err instanceof Error ? err.message : String(err))
      );
      // Set empty state in case of error
      setPersonas([]);
      setSummary("");
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
      const enhancedPersonas = await generatePersonasApi(
        offering,
        selectedCountry,
        1
      );

      if (enhancedPersonas && enhancedPersonas.length > 0) {
        // Convert string ageMin/ageMax values to numbers if needed
        const newPersona = {
          ...enhancedPersonas[0],
          ageMin:
            typeof enhancedPersonas[0].ageMin === "string"
              ? parseInt(enhancedPersonas[0].ageMin as string, 10)
              : enhancedPersonas[0].ageMin,
          ageMax:
            typeof enhancedPersonas[0].ageMax === "string"
              ? parseInt(enhancedPersonas[0].ageMax as string, 10)
              : enhancedPersonas[0].ageMax,
          // Ensure interests is an array
          interests: Array.isArray(enhancedPersonas[0].interests)
            ? enhancedPersonas[0].interests
            : enhancedPersonas[0].interests
            ? typeof enhancedPersonas[0].interests === "string"
              ? [enhancedPersonas[0].interests]
              : [String(enhancedPersonas[0].interests)]
            : ["Product offering", "Services"],
        };

        setPersonas((prevPersonas) => {
          const newPersonas = [...prevPersonas];
          newPersonas[index] = newPersona;
          return newPersonas;
        });

        toast.success("Persona regenerated successfully");

        return newPersona;
      }

      return null;
    } catch (err) {
      logError("Error regenerating persona:", err);
      toast.error(
        "Something went wrong: " +
          (err instanceof Error ? err.message : String(err))
      );
      return null;
    }
  };

  /**
   * Update a persona at the specified index
   */
  const updatePersona = (index: number, updatedPersona: Persona) => {
    logInfo(`Updating persona at index ${index}`);
    setPersonas((prevPersonas) => {
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
    regenerateSinglePersona,
    setPersonas, // Export this to allow setting personas from saved data
  };
};
