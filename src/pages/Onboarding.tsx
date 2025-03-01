
import React, { useState, useRef, useEffect } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Onboarding = () => {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [offering, setOffering] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognition = useRef<SpeechRecognition | null>(null);
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
  }, [sellingPoints, interimTranscript]);
  
  // Initialize speech recognition
  const initSpeechRecognition = () => {
    if (!recognition.current) {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // Need to use type assertion to satisfy TypeScript
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognition.current = new SpeechRecognitionAPI();
        
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        
        recognition.current.onresult = (event: SpeechRecognitionEvent) => {
          let interimText = '';
          let finalText = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalText += transcript + ' ';
            } else {
              interimText += transcript;
            }
          }
          
          if (finalText) {
            setSellingPoints(prev => prev + finalText);
            setInterimTranscript('');
          }
          
          setInterimTranscript(interimText);
        };
        
        recognition.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          setInterimTranscript('');
          toast({
            title: "Error",
            description: `Speech recognition error: ${event.error}`,
            variant: "destructive",
          });
        };
        
        recognition.current.onend = () => {
          // If there's any interim text left when recognition ends, add it to the main text
          if (interimTranscript) {
            setSellingPoints(prev => prev + interimTranscript + ' ');
            setInterimTranscript('');
          }
          setIsListening(false);
        };
      } else {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const startListening = () => {
    if (!initSpeechRecognition()) return;
    
    try {
      recognition.current?.start();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast({
        title: "Error",
        description: "Failed to start speech recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      // onend will handle updating the text and resetting isListening
    }
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
                      <div className="w-64 flex flex-col items-center">
                        <Textarea
                          ref={textareaRef}
                          value={sellingPoints + (interimTranscript ? interimTranscript : '')}
                          onChange={(e) => setSellingPoints(e.target.value)}
                          className="min-h-[100px] w-full overflow-hidden resize-none"
                          style={{ height: 'auto' }}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`text-sm text-gray-500 cursor-pointer w-full mt-0 border border-input ${isListening ? 'bg-blue-50' : 'bg-white/80'}`}
                          onMouseDown={startListening}
                          onMouseUp={stopListening}
                          onMouseLeave={stopListening}
                          onTouchStart={startListening}
                          onTouchEnd={stopListening}
                        >
                          <Mic size={18} className={`${isListening ? 'text-red-500' : 'text-blue-500'} mr-1`} />
                          {isListening ? 'Listening...' : 'Hold to talk'}
                        </Button>
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
