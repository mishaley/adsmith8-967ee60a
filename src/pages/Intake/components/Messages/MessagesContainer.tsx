
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
  // Ensure personas is always an array, even if it's undefined or null
  const safePersonas = Array.isArray(personas) ? personas : [];
  
  return (
    <div className="rounded-lg border mb-8">
      <div className="border-b bg-gray-50 p-3 rounded-t-lg">
        <h2 className="text-lg font-semibold text-center">Campaign Messages</h2>
      </div>
      <div className="p-5">
        <MessagesSection 
          personas={safePersonas} 
          onUpdateMessages={onUpdateMessages} 
        />
      </div>
    </div>
  );
};

export default MessagesContainer;
