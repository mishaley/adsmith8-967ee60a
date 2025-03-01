
import React, { useState, useRef, useEffect } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [offering, setOffering] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  // Auto-resize textarea when content changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set the height to match the content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [sellingPoints]);
  
  const startRecording = async () => {
    try {
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Event handler for when data becomes available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Event handler for when recording stops
      mediaRecorder.onstop = async () => {
        try {
          setIsTranscribing(true);
          
          // Combine audio chunks into a single blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert blob to base64
          const base64Audio = await blobToBase64(audioBlob);
          
          // Call Supabase Edge Function for transcription
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio.split(',')[1] } // Remove data URL prefix
          });
          
          if (error) {
            throw new Error(error.message);
          }
          
          // Add transcribed text to the selling points
          if (data?.text) {
            setSellingPoints(prev => (prev ? prev + ' ' : '') + data.text);
          }
        } catch (error) {
          console.error('Transcription error:', error);
          toast({
            title: "Error",
            description: `Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        } finally {
          setIsTranscribing(false);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Error",
        description: `Failed to access microphone: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  // Utility function to convert a Blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="w-full">
            <p className="text-lg mb-4">Welcome to Adsmith! Your marketing ROI is our only focus.</p>
            <p className="text-lg mb-4">
              Let's get a demo campaign set up. It'll only take a few minutes.
            </p>
            
            <div className="mt-8">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg whitespace-nowrap w-auto">What's your brand name?</td>
                    <td className="py-4 w-full">
                      <Input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-64"
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg whitespace-nowrap w-auto">What industry are you in?</td>
                    <td className="py-4 w-full">
                      <Input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-64"
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg whitespace-nowrap w-auto">Name one of your offerings (we can add more later)</td>
                    <td className="py-4 w-full">
                      <Input
                        type="text"
                        value={offering}
                        onChange={(e) => setOffering(e.target.value)}
                        className="w-64"
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg whitespace-nowrap w-auto">Key Selling Points</td>
                    <td className="py-4 w-full">
                      <div className="w-96 flex flex-col">
                        <div className="w-full">
                          <Textarea
                            ref={textareaRef}
                            value={sellingPoints}
                            onChange={(e) => setSellingPoints(e.target.value)}
                            className="min-h-[36px] w-full overflow-hidden resize-none"
                            style={{ height: 'auto' }}
                            rows={1}
                          />
                        </div>
                        <div className="relative w-full mt-0">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`text-sm text-gray-500 cursor-pointer w-full border border-input ${isRecording ? 'bg-red-50' : isTranscribing ? 'bg-yellow-50' : 'bg-white/80'}`}
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onMouseLeave={isRecording ? stopRecording : undefined}
                            onTouchStart={startRecording}
                            onTouchEnd={stopRecording}
                            disabled={isTranscribing}
                          >
                            <Mic size={18} className={`${isRecording ? 'text-red-500' : isTranscribing ? 'text-yellow-500' : 'text-blue-500'} mr-1`} />
                            {isRecording 
                              ? 'Recording...' 
                              : isTranscribing 
                                ? 'Transcribing...' 
                                : 'Hold to talk'}
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg"></td>
                    <td className="py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Onboarding;
