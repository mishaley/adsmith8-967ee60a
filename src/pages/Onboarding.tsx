
import React, { useState, useRef, useEffect } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                             (window as any).webkitSpeechRecognition;

const Onboarding = () => {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [offering, setOffering] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [tempTranscript, setTempTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [sellingPoints, tempTranscript]);
  
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          setIsTranscribing(true);
          
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const base64Audio = await blobToBase64(audioBlob);
          
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio.split(',')[1] }
          });
          
          if (error) {
            throw new Error(error.message);
          }
          
          if (data?.text) {
            const finalText = data.text;
            setSellingPoints(finalText);
            setTempTranscript("");
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
      
      mediaRecorder.start();
      setIsRecording(true);
      
      if (typeof SpeechRecognitionAPI !== 'undefined') {
        try {
          const recognition = new SpeechRecognitionAPI();
          recognitionRef.current = recognition;
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';
          
          recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                interimTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            
            if (interimTranscript) {
              setTempTranscript(interimTranscript);
              setSellingPoints(interimTranscript);
            }
          };
          
          recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
          };
          
          recognition.start();
        } catch (e) {
          console.error('Speech recognition not supported:', e);
        }
      }
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
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
      recognitionRef.current = null;
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
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
                        <div className="relative w-full">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`text-sm text-gray-500 cursor-pointer w-full border border-input rounded-t-md rounded-b-none ${isRecording ? 'bg-red-50' : isTranscribing ? 'bg-yellow-50' : 'bg-white/80'}`}
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
                                : 'Hold and Talk'}
                          </Button>
                        </div>
                        <div className="w-full">
                          <Textarea
                            ref={textareaRef}
                            value={sellingPoints}
                            onChange={(e) => setSellingPoints(e.target.value)}
                            className="min-h-[36px] w-full overflow-hidden resize-none rounded-t-none rounded-b-md"
                            style={{ height: 'auto' }}
                            rows={1}
                          />
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
