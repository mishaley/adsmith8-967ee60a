
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { formatTime } from "../utils/timeUtils";

interface RecordingButtonProps {
  isRecording: boolean;
  isTranscribing: boolean;
  timer: number;
  volume?: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const RecordingButton = ({
  isRecording,
  isTranscribing,
  timer,
  volume = 0,
  onStartRecording,
  onStopRecording
}: RecordingButtonProps) => {
  return (
    <div className="w-full">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`text-sm text-gray-500 cursor-pointer w-full border border-input rounded-t-md rounded-b-none ${isRecording ? 'bg-red-50' : isTranscribing ? 'bg-yellow-50' : 'bg-white/80'}`}
        onMouseDown={onStartRecording}
        onMouseUp={onStopRecording}
        onMouseLeave={isRecording ? onStopRecording : undefined}
        onTouchStart={onStartRecording}
        onTouchEnd={onStopRecording}
        disabled={isTranscribing}
      >
        <Mic size={18} className={`${isRecording ? 'text-red-500' : isTranscribing ? 'text-yellow-500' : 'text-blue-500'} mr-1`} />
        {isRecording 
          ? formatTime(timer)
          : isTranscribing 
            ? 'Transcribing...' 
            : 'Hold and Talk'}
      </Button>
      
      {/* Volume indicator bar */}
      {isRecording && (
        <div className="h-1 bg-gray-200 w-full">
          <div 
            className="h-full bg-green-500 transition-all duration-100 ease-in-out"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default RecordingButton;
