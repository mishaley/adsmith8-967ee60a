
import React from "react";
import CollapsibleSection from "../CollapsibleSection";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

const LaunchSection: React.FC = () => {
  return (
    <CollapsibleSection title="LAUNCH">
      <div className="p-4 bg-transparent rounded-md space-y-6">
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-lg mb-6 text-center">
            Your campaign is ready to launch! Click the button below to proceed.
          </p>
          <Button 
            className="flex items-center gap-2 px-6 py-5 text-lg"
            size="lg"
          >
            <Rocket className="h-5 w-5" />
            Launch Campaign
          </Button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default LaunchSection;
