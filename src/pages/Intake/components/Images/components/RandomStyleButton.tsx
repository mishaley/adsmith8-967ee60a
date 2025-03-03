
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { getRandomApprovedStyle } from "../utils/imageGenerationUtils";
import { useToast } from "@/hooks/use-toast";

interface RandomStyleButtonProps {
  onStyleSelected?: (style: string) => void;
}

const RandomStyleButton: React.FC<RandomStyleButtonProps> = ({
  onStyleSelected
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();

  const handleGetRandomStyle = async () => {
    setIsLoading(true);
    try {
      const randomStyle = await getRandomApprovedStyle();
      if (onStyleSelected) {
        onStyleSelected(randomStyle);
      }
      
      // Show success toast with the selected style name
      toast({
        title: "Style Selected",
        description: `Style "${randomStyle}" has been selected`,
        duration: 3000 // Will disappear after 3 seconds
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get random style";
      toast({
        title: "Style Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000 // Will disappear after 3 seconds
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="flex justify-center items-center gap-3 w-full">
      <Button onClick={handleGetRandomStyle} variant="outline" size="sm" disabled={isLoading} className="text-center">
        {isLoading ? "Loading..." : "Get Random Style"}
      </Button>
    </div>;
};

export default RandomStyleButton;
