
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
  updatePersona?: (index: number, updatedPersona: Persona) => void;
}

const PersonasSection: React.FC<PersonasSectionProps> = ({
  personas,
  summary,
  isGeneratingPersonas,
  generatePersonas,
  updatePersona
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
        // Create a new persona with the updated portrait URL
        const updatedPersona = { ...persona, portraitUrl: imageUrl };
        
        // Update the persona in the parent component if callback is provided
        if (updatePersona) {
          updatePersona(index, updatedPersona);
        }
        
        toast({
          title: "Portrait Generated",
          description: `Portrait for ${persona.title} has been generated.`,
        });
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
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
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
          <div className="w-full text-left pl-4 flex items-center">
            <span>Personas</span>
            <Button 
              onClick={generatePersonas} 
              disabled={isGeneratingPersonas}
              className="ml-4"
              size="sm"
            >
              {isGeneratingPersonas ? "Generating..." : "Generate"}
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
                {/* Persona descriptions row */}
                <tr>
                  {personas.length > 0 ? (
                    personas.map((persona, index) => (
                      <td key={index} className="py-3 px-3 border-r align-top" style={{ width: "20%" }}>
                        <div className="flex flex-col">
                          <div className="font-medium">{persona.title}</div>
                          <div>{persona.gender}, age {persona.ageMin}-{persona.ageMax}</div>
                          <div>{persona.interests.join(", ")}</div>
                        </div>
                      </td>
                    ))
                  ) : (
                    Array.from({ length: 5 }).map((_, index) => (
                      <td key={index} className="py-4 px-2 border-r" style={{ width: "20%" }}></td>
                    ))
                  )}
                </tr>
                
                {/* Portraits row */}
                <tr>
                  {personas.length > 0 ? (
                    personas.map((persona, index) => (
                      <td key={index} className="py-3 px-3 border-r" style={{ width: "20%" }}>
                        <div className="flex flex-col items-center">
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
                      </td>
                    ))
                  ) : (
                    Array.from({ length: 5 }).map((_, index) => (
                      <td key={index} className="py-4 px-2 border-r" style={{ width: "20%" }}></td>
                    ))
                  )}
                </tr>
                
                {/* Empty row for spacing/alignment */}
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
