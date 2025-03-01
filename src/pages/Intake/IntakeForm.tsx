
import React, { useState } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import IntakeHeader from "./components/IntakeHeader";
import IntakeFormFields from "./components/IntakeFormFields";
import PersonasSection from "./components/PersonasSection";
import { generatePersonaSummary } from "./utils/personaUtils";

interface Persona {
  title: string;
  gender: string;
  ageMin: number;
  ageMax: number;
  interests: string[];
}

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
      const { data, error } = await supabase.functions.invoke('generate-personas', {
        body: { product: offering || "ramen noodles" }
      });

      if (error) {
        console.error("Error generating personas:", error);
        toast.error("Failed to generate personas");
        return;
      }

      if (data && data.personas) {
        setPersonas(data.personas);
        
        // Generate a summary
        const newSummary = generatePersonaSummary(offering, data.personas);
        setSummary(newSummary);
        
        toast.success("Personas generated successfully");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsGeneratingPersonas(false);
    }
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
