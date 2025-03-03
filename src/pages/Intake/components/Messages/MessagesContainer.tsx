
import React from "react";
import { Persona } from "../Personas/types";
import MessagesSection from "./MessagesSection";
import { Message } from "./hooks/useMessagesFetching";

interface MessagesContainerProps {
  personas: Persona[];
  onUpdateMessages?: (generatedMessages: Record<string, Record<string, Message>>, selectedTypes: string[]) => void;
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({ 
  personas,
  onUpdateMessages
}) => {
  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Messages</span>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="p-0">
          <div className="bg-[#e9f2fe] p-4 mb-6 rounded-lg">
            <table className="w-full border-collapse border-transparent">
              <tbody>
                <MessagesSection 
                  personas={personas} 
                  onUpdateMessages={onUpdateMessages} 
                />
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  );
};

export default MessagesContainer;
