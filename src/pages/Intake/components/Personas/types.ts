
// Define the interface for a persona
export interface Persona {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  portraitUrl?: string;
  gender: string; // Now required for consistency
  age?: string;
  ageMin?: number; // Changed to be only number type for consistency
  ageMax?: number; // Changed to be only number type for consistency
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
