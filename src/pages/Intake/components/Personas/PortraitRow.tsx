import React from "react";
import { Persona } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader, RefreshCw } from "lucide-react";

interface PortraitRowProps {
  personas: Persona[];
  isGeneratingPortraits: boolean;
  loadingIndices: number[];
  onRetryPortrait?: (index: number) => void;
  personaCount?: number;
}

const PortraitRow: React.FC<PortraitRowProps> = ({
  personas,
  isGeneratingPortraits,
  loadingIndices,
  onRetryPortrait,
  personaCount = 5, // Default to 5 for backward compatibility
}) => {
  const isLoading = (index: number) => loadingIndices.includes(index);

  // Calculate width percentage based on persona count
  const getColumnWidth = () => {
    return `${100 / personaCount}%`;
  };

  return (
    <tr className="border-transparent">
      {Array.from({ length: personaCount }).map((_, index) =>
       {
        console.log(personas[index]?.gender);
        
        return (
          <td
            key={index}
            className="py-2 px-4 border-transparent"
            style={{ width: getColumnWidth() }}
          >
            {personas[index] ? (
              <div className="flex items-center space-x-3">
                <Avatar className="border border-gray-200">
                  {personas[index].portraitUrl ? (
                    <AvatarImage
                      src={personas[index].portraitUrl}
                      alt={personas[index].gender}
                      onError={(e) => {
                        console.error(
                          `Error loading portrait for persona ${index}`,
                          e
                        );
                        e.currentTarget.src = ""; // Clear the src to show fallback
                      }}
                    />
                  ) : (
                    <>
                      <AvatarFallback>
                        {personas[index].gender?.[0]
                          ? personas[index].gender?.[0]
                          : personas[index].gender || "?"}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div>
                  {onRetryPortrait ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRetryPortrait(index)}
                      disabled={isGeneratingPortraits && !isLoading(index)}
                    >
                      {isLoading(index) ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {personas[index].portraitUrl
                            ? "Regenerate"
                            : "Generate Portrait"}
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </td>
        );
      })}
    </tr>
  );
};

export default PortraitRow;
