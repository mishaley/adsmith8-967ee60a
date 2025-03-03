import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dice1 } from "lucide-react";
import { getRandomApprovedStyle } from "../utils/imageGenerationUtils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const StyleTester: React.FC = () => {
  const [randomStyle, setRandomStyle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagInfo, setDiagInfo] = useState<string | null>(null);
  
  useEffect(() => {
    handleGetRandomStyle();
  }, []);

  const handleGetRandomStyle = async () => {
    setIsLoading(true);
    setError(null);
    setDiagInfo(null);
    
    try {
      const { data: tableInfo, error: tableError } = await supabase
        .from('y1styles')
        .select('*', { count: 'exact', head: true });
      
      if (tableInfo !== null) {
        setDiagInfo(`Database has ${tableInfo.count || 0} total styles`);
      }
      
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
    <div className="p-4 border rounded-md bg-white shadow-sm mb-6">
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
          <Alert variant="destructive" className="w-full">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-sm">{error}</AlertDescription>
            {diagInfo && <p className="mt-2 text-xs">{diagInfo}</p>}
          </Alert>
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
