import React, { useState } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import FormField from "./components/FormField";
import RecordingField from "./components/RecordingField";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  
  const PLATFORM_OPTIONS = ["Google", "Meta"];
  
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
        const demographics = data.personas.map((p: Persona) => 
          `${p.gender} aged ${p.ageMin}-${p.ageMax}`
        ).join(", ");
        
        setSummary(`Target audience for ${offering || "ramen noodles"}: ${demographics}. Key interests include ${collectInterests(data.personas).join(", ")}.`);
        
        toast.success("Personas generated successfully");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsGeneratingPersonas(false);
    }
  };

  const collectInterests = (personaList: Persona[]) => {
    // Get all interests and count occurrences
    const interestCounts: Record<string, number> = {};
    personaList.forEach(persona => {
      persona.interests.forEach(interest => {
        interestCounts[interest] = (interestCounts[interest] || 0) + 1;
      });
    });
    
    // Sort by count and return top 5
    return Object.entries(interestCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
  };
  
  return <QuadrantLayout>
      {{
      q4: <div className="w-full">
            <p className="text-lg mb-4">Welcome to Adsmith! Your marketing ROI is our only focus.</p>
            <p className="text-lg mb-4">
              Let's get a demo campaign set up. It'll only take a few minutes.
            </p>
            
            <div className="mt-8">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg">
                      <div>What's your brand name?</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-96">
                          <input
                            type="text"
                            value={brandName}
                            onChange={e => setBrandName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <Button onClick={handleSave}>Save</Button>
                      </div>
                    </td>
                  </tr>
                  <FormField label="What industry are you in?" value={industry} onChange={e => setIndustry(e.target.value)} />
                  <FormField label="Name one of your offerings" helperText="We can add more later" helperTextClassName="text-sm text-gray-500 mt-1" value={offering} onChange={e => setOffering(e.target.value)} />
                  <RecordingField label="Key Selling Points" helperText="Main reasons why customers buy this offering" value={sellingPoints} onChange={setSellingPoints} placeholder="Speak for at least 30 seconds" />
                  <RecordingField label="Problem Solved" helperText="How does this offering help your customers?" value={problemSolved} onChange={setProblemSolved} placeholder="Speak for at least 30 seconds" />
                  <RecordingField label="Unique Advantages" helperText="How is this offering better than alternatives?" value={uniqueOffering} onChange={setUniqueOffering} placeholder="Speak for at least 30 seconds" />
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg">
                      <div>Ad Platform</div>
                    </td>
                    <td className="py-4">
                      <div className="inline-block min-w-[180px]">
                        <Select value={adPlatform} onValueChange={(value) => {
                          if (value === "clear-selection") {
                            setAdPlatform("");
                          } else {
                            setAdPlatform(value);
                          }
                        }}>
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
                            {PLATFORM_OPTIONS.map((platform) => (
                              <SelectItem 
                                key={platform}
                                value={platform}
                              >
                                {platform}
                              </SelectItem>
                            ))}
                            <SelectSeparator className="my-1" />
                            <SelectItem value="clear-selection" className="text-gray-500">
                              Clear
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td colSpan={2} className="py-4 text-lg">
                      <div className="w-full text-left pl-4"></div>
                    </td>
                  </tr>
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
                  <tr className="border-b">
                    <td colSpan={2} className="py-4 text-lg">
                      <div className="w-full text-left pl-4"></div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td colSpan={5} className="py-4 px-2 text-base">
                      {summary ? (
                        <div className="bg-gray-50 p-3 rounded-md">{summary}</div>
                      ) : (
                        <div className="text-gray-400 italic">Click "Generate Personas" to create target audience profiles</div>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    {personas.length > 0 ? (
                      personas.map((persona, index) => (
                        <td key={index} className="py-3 px-3 border-r align-top w-1/5">
                          <div className="flex flex-col h-full">
                            <div className="font-medium">{persona.title}</div>
                            <div>{persona.gender}</div>
                            <div>{persona.ageMin}-{persona.ageMax}</div>
                            <div>{persona.interests.join(", ")}</div>
                          </div>
                        </td>
                      ))
                    ) : (
                      Array.from({ length: 5 }).map((_, index) => (
                        <td key={index} className="py-4 px-2 border-r min-h-[100px] w-1/5"></td>
                      ))
                    )}
                  </tr>
                  <tr className="border-b">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <td key={index} className="py-4 px-2 border-r min-h-[100px] w-1/5"></td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
    }}
    </QuadrantLayout>;
};
export default IntakeForm;
