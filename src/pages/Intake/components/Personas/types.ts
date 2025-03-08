
// Define the interface for a persona
export interface Persona {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  gender?: string;
  age?: string;
  occupation?: string;
  interests?: string[];
  race?: string;
  loading?: boolean;
  error?: string;
}

// Define the interface for persona generation response
export interface PersonaGenerationResponse {
  personas: Persona[];
  summary?: string;
}
