
import { STORAGE_KEYS } from "../../utils/localStorageUtils";
import { useLocalStorageState } from "./useLocalStorageState";
import { Persona } from "../../components/Personas/types";

export const usePersonaForm = () => {
  const [personas, setPersonas] = useLocalStorageState<Persona[]>(
    `${STORAGE_KEYS.PERSONAS}_data`, 
    []
  );
  
  return {
    personas,
    setPersonas
  };
};
