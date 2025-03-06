
import { useEffect } from "react";
import { toast } from "sonner";

interface UseSelectionRetryProps {
  initialized: boolean;
  selectedCountry: string;
  setSelectedCountryId: ((id: string) => void) | null;
}

/**
 * Hook to handle retrying map country selection
 */
export const useSelectionRetry = ({
  initialized,
  selectedCountry,
  setSelectedCountryId
}: UseSelectionRetryProps) => {
  
  // Enhanced retry mechanism for highlighting countries
  useEffect(() => {
    let retryTimer: NodeJS.Timeout;
    
    if (initialized && selectedCountry && setSelectedCountryId) {
      // Initial retry after a delay
      retryTimer = setTimeout(() => {
        console.log(`Retry 1: Ensuring country selection for ${selectedCountry}`);
        setSelectedCountryId(selectedCountry);
      }, 1500);
      
      // Secondary retry with a longer delay
      const secondaryRetryTimer = setTimeout(() => {
        if (initialized && setSelectedCountryId) {
          console.log(`Retry 2: Final attempt for country selection ${selectedCountry}`);
          setSelectedCountryId(selectedCountry);
          
          // Show a toast for user feedback
          toast.info("Refreshing map selection...", {
            duration: 2000,
          });
        }
      }, 3000);
      
      return () => {
        clearTimeout(retryTimer);
        clearTimeout(secondaryRetryTimer);
      };
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [initialized, selectedCountry, setSelectedCountryId]);
};
