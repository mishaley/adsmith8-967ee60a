
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dice1 } from "lucide-react";
import { getRandomApprovedStyle } from "../utils/imageGenerationUtils";

const StyleTester: React.FC = () => {
  const [randomStyle, setRandomStyle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load a random style on component mount
  useEffect(() => {
    handleGetRandomStyle();
  }, []);

  const handleGetRandomStyle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const style = await getRandomApprovedStyle();
      setRandomStyle(style);
    } catch (error) {
      console.error("Error fetching random style:", error);
      setError(error instanceof Error ? error.message : "Failed to get random style");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold">Style Tester</h3>
        <p className="text-sm text-gray-500 text-center">
          Click the button below to fetch a random style from the database
        </p>
        
        <Button 
          onClick={handleGetRandomStyle}
          disabled={isLoading}
          className="gap-2"
        >
          <Dice1 size={16} />
          Get Random Style
        </Button>
        
        {isLoading && <p className="text-gray-500">Loading random style...</p>}
        
        {error && (
          <div className="text-red-500 p-2 bg-red-50 rounded-md w-full text-center">
            {error}
          </div>
        )}
        
        {randomStyle && !isLoading && !error && (
          <div className="bg-green-50 p-4 rounded-md w-full text-center">
            <p className="text-sm text-gray-500">Random style from database:</p>
            <p className="text-lg font-medium text-green-700">{randomStyle}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleTester;
