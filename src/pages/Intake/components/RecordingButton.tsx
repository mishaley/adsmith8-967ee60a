
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RecordingButtonProps {
  isRecording: boolean;
  isTranscribing: boolean;
  timer: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const RecordingButton = ({
  isRecording,
  isTranscribing,
  timer,
  onStartRecording,
  onStopRecording
}: RecordingButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`w-10 h-10 p-0 flex items-center justify-center rounded-none rounded-r-md ${isRecording ? 'bg-red-50' : isTranscribing ? 'bg-yellow-50' : 'bg-[#d3e4fd]'} border border-input`}
            onMouseDown={onStartRecording}
            onMouseUp={onStopRecording}
            onMouseLeave={isRecording ? onStopRecording : undefined}
            onTouchStart={onStartRecording}
            onTouchEnd={onStopRecording}
            disabled={isTranscribing}
            aria-label={isRecording ? "Recording" : isTranscribing ? "Transcribing" : "Hold to record"}
          >
            <Mic size={18} className={`${isRecording ? 'text-red-500' : isTranscribing ? 'text-yellow-500' : 'text-white'}`} />
          </Button>
        </TooltipTrigger>
        {!isRecording && !isTranscribing && (
          <TooltipContent side="right" sideOffset={5}>
            <p>Hold to talk</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default RecordingButton;
