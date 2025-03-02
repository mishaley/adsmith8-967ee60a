
import React, { useState } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import IntakeHeader from "./components/IntakeHeader";
import IntakeFormFields from "./components/IntakeFormFields";
import PersonasSection from "./components/Personas/PersonasSection";
import { generatePersonaSummary, normalizeGender } from "./utils/personaUtils";
import { Persona } from "./components/Personas/types";

const IntakeForm = () => {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [offering, setOffering] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [problemSolved, setProblemSolved] = useState(""); 
  const [uniqueOffering, setUniqueOffering] = useState("");
  const [adPlatform, setAdPlatform] = useState("");
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);
  const [summary, setSummary] = useState("");
  
  const handleSave = () => {
    console.log("Saving form data:", {
      brandName,
      industry,
      offering,
      sellingPoints,
      problemSolved,
      uniqueOffering,
      adPlatform
    });
    // Here you would typically save the data to a database
  };

  const generatePersonas = async () => {
    if (!offering) {
      toast.error("Please enter an offering first");
      return;
    }

    setIsGeneratingPersonas(true);
    try {
      console.log("Calling generate-personas with product:", offering);
      
      const { data, error } = await supabase.functions.invoke('generate-personas', {
        body: { product: offering || "ramen noodles" }
      });

      console.log("Response from generate-personas:", data, error);

      if (error) {
        console.error("Error generating personas:", error);
        toast.error("Failed to generate personas: " + error.message);
        return;
      }

      if (!data) {
        console.error("No data received from generate-personas");
        toast.error("No data received from the server");
        return;
      }

      if (data && data.personas) {
        // Normalize gender values in the personas
        const normalizedPersonas = data.personas.map((persona: Persona) => ({
          ...persona,
          gender: normalizeGender(persona.gender)
        }));
        
        console.log("Generated personas:", normalizedPersonas);
        setPersonas(normalizedPersonas);
        
        // Generate a summary with normalized personas
        const newSummary = generatePersonaSummary(offering, normalizedPersonas);
        setSummary(newSummary);
        
        toast.success("Personas generated successfully");
      } else {
        console.error("No personas data received:", data);
        toast.error("No personas data received");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGeneratingPersonas(false);
    }
  };

  const updatePersona = (index: number, updatedPersona: Persona) => {
    const updatedPersonas = [...personas];
    updatedPersonas[index] = updatedPersona;
    setPersonas(updatedPersonas);
  };
  
  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="w-full">
            <IntakeHeader />
            
            <div className="mt-8">
              <table className="w-full border-collapse">
                <tbody>
                  <IntakeFormFields 
                    brandName={brandName}
                    setBrandName={setBrandName}
                    industry={industry}
                    setIndustry={setIndustry}
                    offering={offering}
                    setOffering={setOffering}
                    sellingPoints={sellingPoints}
                    setSellingPoints={setSellingPoints}
                    problemSolved={problemSolved}
                    setProblemSolved={setProblemSolved}
                    uniqueOffering={uniqueOffering}
                    setUniqueOffering={setUniqueOffering}
                    adPlatform={adPlatform}
                    setAdPlatform={setAdPlatform}
                    handleSave={handleSave}
                  />
                  
                  <PersonasSection 
                    personas={personas}
                    summary={summary}
                    isGeneratingPersonas={isGeneratingPersonas}
                    generatePersonas={generatePersonas}
                    updatePersona={updatePersona}
                  />
                </tbody>
              </table>
            </div>
          </div>
        )
      }}
    </QuadrantLayout>
  );
};

export default IntakeForm;
