
import React, { useState } from "react";
import CollapsibleSection from "../CollapsibleSection";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

const CaptionsSection: React.FC = () => {
  const [caption, setCaption] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateCaption = () => {
    setIsGenerating(true);
    // Simulate generation - in a real app, this would call an API
    setTimeout(() => {
      setCaption("This is a sample auto-generated caption for your advertisement. It highlights your product's key features and benefits.");
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <CollapsibleSection title="CAPTIONS">
      <div className="p-4 bg-white rounded-md">
        <div className="mb-4">
          <Textarea
            placeholder="Enter or generate a caption for your advertisement"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleGenerateCaption}
            disabled={isGenerating}
            size="sm"
            className="flex items-center gap-1"
          >
            <Wand2 className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Caption"}
          </Button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default CaptionsSection;
