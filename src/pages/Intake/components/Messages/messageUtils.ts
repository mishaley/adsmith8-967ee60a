
import { Persona } from "../Personas/types";

export const getMessageTypeLabel = (type: string): string => {
  switch (type) {
    case "pain-point": return "Pain Point";
    case "unique-offering": return "Unique Offering";
    case "value-prop": return "Value Prop";
    case "user-provided": return "User Provided";
    default: return type;
  }
};

export const getMessageContentByType = (type: string, persona: Persona, index: number): string => {
  const personaName = persona.title || `Persona ${index + 1}`;
  
  switch (type) {
    case "pain-point":
      return `${personaName} is frustrated with traditional solutions that are ${persona.gender === 'Men' ? 'time-consuming' : 'complicated'} and expensive.`;
    case "unique-offering":
      return `Our solution offers ${personaName} a streamlined experience with intuitive controls and affordable pricing.`;
    case "value-prop":
      return `${personaName} will save 30% more time and money while achieving better results with our innovative approach.`;
    default:
      return `Message for ${personaName} with type: ${type}`;
  }
};
