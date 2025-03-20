
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OfferingDetails {
  offering_name: string;
  offering_keysellingpoints: string | null;
  offering_problemssolved: string | null;
  offering_uniqueadvantages: string | null;
}

export const useOfferingDetails = (offeringId: string) => {
  // Fetch offering details when an offering is selected
  const { data: offeringDetails, refetch } = useQuery({
    queryKey: ["offering-details", offeringId],
    queryFn: async () => {
      // Don't fetch if we're creating a new offering or no offering is selected
      if (offeringId === "new-offering" || !offeringId) {
        return null;
      }
      
      try {
        const { data, error } = await supabase
          .from("b1offerings")
          .select("offering_name, offering_keysellingpoints, offering_problemssolved, offering_uniqueadvantages")
          .eq("offering_id", offeringId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching offering details:", error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error("Unexpected error fetching offering:", error);
        return null;
      }
    },
    enabled: !!offeringId && offeringId !== "new-offering",
  });

  return {
    offeringDetails,
    refetchOfferingDetails: refetch
  };
};
