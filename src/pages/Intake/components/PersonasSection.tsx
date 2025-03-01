
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader, Image } from "lucide-react";

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

const SESSION_STORAGE_KEY = "personaPortraits";

const PersonasSection: React.FC<PersonasSectionProps> = ({
  personas,
  summary,
  isGeneratingPersonas,
  generatePersonas,
  updatePersona
}) => {
  const [generatingPortraitFor, setGeneratingPortraitFor] = useState<number | null>(null);
  const [generatingAllPortraits, setGeneratingAllPortraits] = useState<boolean>(false);
  const { toast } = useToast();

  // Load portraits from session storage when personas change
  useEffect(() => {
    if (personas.length > 0) {
      try {
        const storedPortraits = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (storedPortraits) {
          const portraitsData = JSON.parse(storedPortraits);
          
          // Update personas with stored portrait URLs
          personas.forEach((persona, index) => {
            if (portraitsData[index] && updatePersona) {
              updatePersona(index, { ...persona, portraitUrl: portraitsData[index] });
            }
          });
        }
      } catch (error) {
        console.error("Error loading portraits from session storage:", error);
      }
    }
  }, [personas.length]); // Only run when the number of personas changes

  // Save portrait URLs to session storage whenever a portrait is generated
  const savePortraitsToSession = (personaList: Persona[]) => {
    try {
      const portraitUrls = personaList.map(p => p.portraitUrl || "");
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(portraitUrls));
    } catch (error) {
      console.error("Error saving portraits to session storage:", error);
    }
  };

  const generatePortrait = async (persona: Persona, index: number) => {
    if (generatingPortraitFor !== null || generatingAllPortraits) return;
    
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
          
          // Save all portraits to session storage
          const updatedPersonas = [...personas];
          updatedPersonas[index] = updatedPersona;
          savePortraitsToSession(updatedPersonas);
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

  const generateAllPortraits = async () => {
    if (personas.length === 0 || generatingAllPortraits || generatingPortraitFor !== null) {
      return;
    }

    setGeneratingAllPortraits(true);
    toast({
      title: "Generating All Portraits",
      description: "Starting generation of portraits for all personas...",
    });

    try {
      // Generate portraits for each persona sequentially
      for (let i = 0; i < personas.length; i++) {
        const persona = personas[i];
        
        // Skip if persona already has a portrait
        if (persona.portraitUrl) {
          continue;
        }
        
        const prompt = `Portrait style magazine quality photo of a ${persona.gender}, age ${persona.ageMin}-${persona.ageMax}, who is ${persona.title.toLowerCase()}. ${persona.interests.join(", ")}. High-end fashion magazine photoshoot, professional lighting, clear facial features, headshot, pristine quality.`;
        
        const { data, error } = await supabase.functions.invoke('ideogram-test', {
          body: { prompt }
        });
        
        if (error) {
          console.error(`Error generating portrait for persona ${i}:`, error);
          continue; // Continue with the next persona even if one fails
        }
        
        let imageUrl = null;
        if (data.imageUrl) {
          imageUrl = data.imageUrl;
        } else if (data.data && data.data.length > 0 && data.data[0].url) {
          imageUrl = data.data[0].url;
        }
        
        if (imageUrl && updatePersona) {
          const updatedPersona = { ...persona, portraitUrl: imageUrl };
          updatePersona(i, updatedPersona);
          
          // Get updated personas with the new portrait
          const updatedPersonas = [...personas];
          updatedPersonas[i] = updatedPersona;
          savePortraitsToSession(updatedPersonas);
        }
      }
      
      toast({
        title: "All Portraits Generated",
        description: "Finished generating portraits for all personas.",
      });
    } catch (error) {
      console.error('Error in generating all portraits:', error);
      toast({
        title: "Portrait Generation Incomplete",
        description: "Error occurred while generating all portraits.",
        variant: "destructive",
      });
    } finally {
      setGeneratingAllPortraits(false);
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
            <Button 
              onClick={generateAllPortraits} 
              disabled={generatingAllPortraits || generatingPortraitFor !== null || personas.length === 0}
              className="ml-2"
              size="sm"
              variant="outline"
            >
              {generatingAllPortraits ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4 mr-2" />
                  Portraits
                </>
              )}
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
                  {Array.from({ length: 5 }).map((_, index) => (
                    <td key={index} className="py-3 px-3 border-r" style={{ width: "20%" }}>
                      <div className="flex flex-col items-center">
                        {personas[index]?.portraitUrl ? (
                          <img 
                            src={personas[index].portraitUrl} 
                            alt={`Portrait of ${personas[index]?.title || `Persona ${index + 1}`}`}
                            className="w-full h-auto rounded-md"
                          />
                        ) : personas.length > 0 && index < personas.length ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generatePortrait(personas[index], index)}
                            disabled={generatingPortraitFor !== null || generatingAllPortraits}
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
                        ) : (
                          <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
                            No persona data
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
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
