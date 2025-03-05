
import React, { useState } from "react";
import CollapsibleSection from "../CollapsibleSection";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ParametersSection: React.FC = () => {
  const [budget, setBudget] = useState<number[]>([500]);
  const [duration, setDuration] = useState<number[]>([30]);
  const [optimizeForConversion, setOptimizeForConversion] = useState<boolean>(true);
  const [enableRetargeting, setEnableRetargeting] = useState<boolean>(false);

  return (
    <CollapsibleSection title="PARAMETERS">
      <div className="p-4 bg-white rounded-md space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="budget">Daily Budget (USD)</Label>
            <span className="font-medium">${budget[0]}</span>
          </div>
          <Slider
            id="budget"
            min={100}
            max={1000}
            step={50}
            value={budget}
            onValueChange={setBudget}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="duration">Campaign Duration (Days)</Label>
            <span className="font-medium">{duration[0]}</span>
          </div>
          <Slider
            id="duration"
            min={7}
            max={90}
            step={1}
            value={duration}
            onValueChange={setDuration}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="optimize-conversion">Optimize for Conversion</Label>
          <Switch
            id="optimize-conversion"
            checked={optimizeForConversion}
            onCheckedChange={setOptimizeForConversion}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="enable-retargeting">Enable Retargeting</Label>
          <Switch
            id="enable-retargeting"
            checked={enableRetargeting}
            onCheckedChange={setEnableRetargeting}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default ParametersSection;
