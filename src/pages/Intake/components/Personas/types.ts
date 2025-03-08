
// Define the interface for a persona
export interface Persona {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  portraitUrl?: string; // Added for compatibility
  gender?: string;
  age?: string;
  ageMin?: string | number; // Added for compatibility
  ageMax?: string | number; // Added for compatibility
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
