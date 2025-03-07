
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader, RefreshCw } from "lucide-react";
import { Persona } from "./types";

interface PortraitRowProps {
  personas: Persona[];
  isGeneratingPortraits: boolean;
  loadingIndices: number[];
  onRetryPortrait?: ((index: number) => void) | null;
  promptText?: string; // Add custom prompt text
}

const PortraitRow: React.FC<PortraitRowProps> = ({
  personas,
  isGeneratingPortraits,
  loadingIndices,
  onRetryPortrait,
  promptText // Custom prompt text
}) => {
  return (
    <tr className="h-44 border-transparent">
      <td colSpan={personas.length} className="p-0">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {personas.map((persona, index) => (
            <div key={index} className="relative flex flex-col items-center">
              {persona.portraitUrl ? (
                <div className="relative w-32 h-32 overflow-hidden rounded-full bg-gray-100">
                  <img
                    src={persona.portraitUrl}
                    alt={`Portrait of ${persona.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-gray-100">
                  {loadingIndices.includes(index) ? (
                    <Loader className="h-8 w-8 animate-spin text-blue-500" />
                  ) : (
                    <span className="text-gray-400 text-sm text-center">No portrait</span>
                  )}
                </div>
              )}
              
              {/* Retry button */}
              {onRetryPortrait && !loadingIndices.includes(index) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => onRetryPortrait(index)}
                  disabled={isGeneratingPortraits}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
};

export default PortraitRow;
