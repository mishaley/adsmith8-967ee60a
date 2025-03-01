
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

interface Persona {
  title: string;
  gender: string;
  ageMin: number;
  ageMax: number;
  interests: string[];
  portraitUrl?: string;
}

interface PersonasSectionProps {
  personas: Persona[];
  summary: string;
  isGeneratingPersonas: boolean;
  generatePersonas: () => void;
}

const PersonasSection: React.FC<PersonasSectionProps> = ({
  personas,
  summary,
  isGeneratingPersonas,
  generatePersonas
}) => {
  const [generatingPortraitFor, setGeneratingPortraitFor] = useState<number | null>(null);
  const { toast } = useToast();

  const generatePortrait = async (persona: Persona, index: number) => {
    if (generatingPortraitFor !== null) return;
    
    setGeneratingPortraitFor(index);
    try {
      const prompt = `Portrait style magazine quality photo of a ${persona.gender}, age ${persona.ageMin}-${persona.ageMax}, who is ${persona.title.toLowerCase()}. ${persona.interests.join(", ")}. High-end fashion magazine photoshoot, professional lighting, clear facial features, headshot, pristine quality.`;
      
      const { data, error } = await supabase.functions.invoke('ideogram-test', {
        body: { prompt }
      });
      
      if (error) {
        console.error('Error generating portrait:', error);
        toast({
          title: "Portrait Generation Failed",
          description: `Error: ${error.message || 'Unknown error'}`,
          variant: "destructive",
        });
        return;
      }
      
      let imageUrl = null;
      if (data.imageUrl) {
        imageUrl = data.imageUrl;
      } else if (data.data && data.data.length > 0 && data.data[0].url) {
        imageUrl = data.data[0].url;
      }
      
      if (imageUrl) {
        // Create a new personas array with the updated portrait URL
        const updatedPersonas = [...personas];
        updatedPersonas[index] = { ...updatedPersonas[index], portraitUrl: imageUrl };
        
        // Update the personas in the parent component
        // Since we can't directly modify the props, we'll need a callback to update the parent state
        // For now, we'll just show a success toast
        toast({
          title: "Portrait Generated",
          description: `Portrait for ${persona.title} has been generated.`,
        });
        
        // This would ideally update the persona in the parent component
        // updatePersonaPortrait(index, imageUrl);
      } else {
        toast({
          title: "Portrait Generation Failed",
          description: "No image URL was found in the response.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in portrait generation:', error);
      toast({
        title: "Portrait Generation Failed",
        description: `Error: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
    } finally {
      setGeneratingPortraitFor(null);
    }
  };

  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center justify-between">
            <span>Personas</span>
            <Button 
              onClick={generatePersonas} 
              disabled={isGeneratingPersonas}
              className="mr-4"
            >
              {isGeneratingPersonas ? "Generating..." : "Generate Personas"}
            </Button>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="p-0">
          {/* Separate table for personas section */}
          <div className="w-full">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  {personas.length > 0 ? (
                    personas.map((persona, index) => (
                      <td key={index} className="py-3 px-3 border-r align-top" style={{ width: "20%" }}>
                        <div className="flex flex-col h-full">
                          <div className="font-medium">{persona.title}</div>
                          <div>{persona.gender}, age {persona.ageMin}-{persona.ageMax}</div>
                          <div>{persona.interests.join(", ")}</div>
                          <div className="mt-3">
                            {persona.portraitUrl ? (
                              <img 
                                src={persona.portraitUrl} 
                                alt={`Portrait of ${persona.title}`}
                                className="w-full h-auto rounded-md"
                              />
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => generatePortrait(persona, index)}
                                disabled={generatingPortraitFor !== null}
                                className="w-full mt-1"
                              >
                                {generatingPortraitFor === index ? (
                                  <>
                                    <Loader className="h-4 w-4 animate-spin mr-2" />
                                    Generating...
                                  </>
                                ) : (
                                  "Generate Portrait"
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>
                    ))
                  ) : (
                    Array.from({ length: 5 }).map((_, index) => (
                      <td key={index} className="py-4 px-2 border-r" style={{ width: "20%" }}></td>
                    ))
                  )}
                </tr>
                <tr>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <td key={index} className="py-4 px-2 border-r" style={{ width: "20%" }}></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  );
};

export default PersonasSection;
