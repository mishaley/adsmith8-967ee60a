
import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../../utils/localStorage";
import { useLocalStorageState } from "./useLocalStorageState";
import { Persona } from "../../components/Personas/types";
import { logDebug } from "@/utils/logging";

export const usePersonaForm = () => {
  const [personas, setPersonas] = useLocalStorageState<Persona[]>(
    `${STORAGE_KEYS.PERSONAS}_data`, 
    []
  );
  
  // Debug log when personas change (moved to debug level to reduce noise)
  useEffect(() => {
    // Only log if personas exist and have length
    if (personas && personas.length > 0) {
      logDebug(`usePersonaForm: personas state updated, count: ${personas.length}`, 'ui');
    }
  }, [personas]);
  
  return {
    personas,
    setPersonas
  };
};
