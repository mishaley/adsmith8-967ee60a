
import React from "react";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordingButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}

const RecordingButton: React.FC<RecordingButtonProps> = ({ 
  isRecording, 
  onStart, 
  onStop 
}) => {
  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isRecording ? "destructive" : "default"}
      size="sm"
      className="flex items-center gap-1"
    >
      {isRecording ? (
        <>
          <Square className="h-4 w-4" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          <span>Record</span>
        </>
      )}
    </Button>
  );
};

export default RecordingButton;
