
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
  
  // Debug log when personas change
  useEffect(() => {
    logDebug(`usePersonaForm: personas state updated, count: ${personas.length}`);
  }, [personas]);
  
  return {
    personas,
    setPersonas
  };
};
