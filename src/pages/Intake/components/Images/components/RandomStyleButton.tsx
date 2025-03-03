
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { getRandomApprovedStyle } from "../utils/imageGenerationUtils";

interface RandomStyleButtonProps {
  onStyleSelected?: (style: string) => void;
}

const RandomStyleButton: React.FC<RandomStyleButtonProps> = ({ onStyleSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRandomStyle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const randomStyle = await getRandomApprovedStyle();
      if (onStyleSelected) {
        onStyleSelected(randomStyle);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get random style");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button 
        onClick={handleGetRandomStyle} 
        variant="outline" 
        size="sm"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Get Random Style"}
      </Button>
      
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
};

export default RandomStyleButton;
