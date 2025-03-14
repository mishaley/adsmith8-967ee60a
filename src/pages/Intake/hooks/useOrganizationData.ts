import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logDebug, logInfo } from "@/utils/logging";

export const useOrganizationData = () => {
  const STORAGE_KEY = "intake_selectedOrganizationId";
  const queryClient = useQueryClient();

  const [selectedOrgId, setSelectedOrgId] = useState<string>(() => {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      logDebug(
        `Initial organization ID from localStorage: ${storedValue || "none"}`,
        "localStorage"
      );
      return storedValue || "";
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return "";
    }
  });

  // Query organizations
  const {
    data: organizations = [],
    isLoading: isLoadingOrganizations,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      logInfo("Fetching organizations from database", "api");
      const { data, error } = await supabase
        .from("a1organizations")
        .select("organization_id, organization_name, organization_industry");

      if (error) throw error;
      logInfo(`Fetched ${data?.length || 0} organizations`, "api");
      return data || [];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    // Subscribe to all changes in the a1organizations table
    const subscription = supabase
      .channel("organizations-channel")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "a1organizations",
        },
        (payload) => {
          logInfo(`Realtime update received: ${payload.eventType}`, "realtime");

          // Update query data based on event type
          queryClient.setQueryData(
            ["organizations"],
            (oldData: any[] | undefined) => {
              const currentData = oldData || [];

              switch (payload.eventType) {
                case "INSERT":
                  return [...currentData, payload.new];

                case "UPDATE":
                  return currentData.map((org) =>
                    org.organization_id === payload.new.organization_id
                      ? payload.new
                      : org
                  );

                case "DELETE":
                  return currentData.filter(
                    (org) => org.organization_id !== payload.old.organization_id
                  );

                default:
                  return currentData;
              }
            }
          );
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
      logDebug("Cleaned up real-time subscription", "realtime");
    };
  }, [queryClient]);

  const currentOrganization = selectedOrgId
    ? organizations.find((org) => org.organization_id === selectedOrgId)
    : null;

  const handleOrgChange = (value: string) => {
    logInfo(`Setting organization ID to: ${value || "none"}`, "ui");
    setSelectedOrgId(value);

    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
        logDebug(
          `Saved organization ID to localStorage: ${value}`,
          "localStorage"
        );
      } else {
        localStorage.removeItem(STORAGE_KEY);
        logDebug("Removed organization ID from localStorage", "localStorage");
      }
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  useEffect(() => {
    const handleClearForm = () => {
      logDebug(
        "Clear form event detected in useOrganizationData",
        "localStorage"
      );
      setSelectedOrgId("");
      localStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("clearForm", handleClearForm);
    return () => {
      window.removeEventListener("clearForm", handleClearForm);
    };
  }, []);

  useEffect(() => {
    if (currentOrganization) {
      logDebug(
        `Current organization: ${
          currentOrganization.organization_name
        }, Industry: ${currentOrganization.organization_industry || "none"}`,
        "ui"
      );
    } else if (selectedOrgId) {
      logDebug(
        `Organization ID ${selectedOrgId} selected but data not loaded yet`,
        "ui"
      );
    }
  }, [currentOrganization, selectedOrgId]);

  return {
    selectedOrgId,
    setSelectedOrgId,
    organizations,
    currentOrganization,
    handleOrgChange,
    isLoadingOrganizations,
  };
};
