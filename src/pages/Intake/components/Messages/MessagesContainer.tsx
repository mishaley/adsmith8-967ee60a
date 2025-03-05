
import React from "react";
import MessagesSection from "./MessagesSection";
import { Persona } from "../Personas/types";

interface MessagesContainerProps {
  personas: Persona[];
  onUpdateMessages?: (generatedMessages: Record<string, Record<string, any>>, selectedTypes: string[]) => void;
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({ 
  personas = [], 
  onUpdateMessages 
}) => {
  // Ensure personas is always an array and filter out any null values
  const safePersonas = Array.isArray(personas) ? personas.filter(Boolean) : [];
  
  return (
    <div>
      <MessagesSection 
        personas={safePersonas} 
        onUpdateMessages={onUpdateMessages} 
      />
    </div>
  );
};

export default MessagesContainer;
