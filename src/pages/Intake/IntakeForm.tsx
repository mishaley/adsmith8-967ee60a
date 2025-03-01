
import React, { useState } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { Input } from "@/components/ui/input";
import FormField from "./components/FormField";
import RecordingField from "./components/RecordingField";

const IntakeForm = () => {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [offering, setOffering] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [problemsSolved, setProblemsSolved] = useState("");
  const [uniqueOffering, setUniqueOffering] = useState("");
  const [geoBoundaries, setGeoBoundaries] = useState("");

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
                  <FormField
                    label="What's your brand name?"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                  <FormField
                    label="What industry are you in?"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                  <FormField
                    label="Name one of your offerings"
                    helperText="We can add more later"
                    value={offering}
                    onChange={(e) => setOffering(e.target.value)}
                  />
                  <RecordingField
                    label="Key Selling Points"
                    helperText="Main reasons why customers buy this offering"
                    value={sellingPoints}
                    onChange={setSellingPoints}
                    placeholder="Speak for at least 30 seconds"
                  />
                  <RecordingField
                    label="Problems Solved"
                    helperText="How does this offering help your customers?"
                    value={problemsSolved}
                    onChange={setProblemsSolved}
                    placeholder="Speak for at least 30 seconds"
                  />
                  <RecordingField
                    label="Unique Offering"
                    helperText="How is this offering better than alternatives?"
                    value={uniqueOffering}
                    onChange={setUniqueOffering}
                    placeholder="Speak for at least 30 seconds"
                  />
                  <RecordingField
                    label="Geo Boundaries"
                    helperText="How is this offering better than alternatives?"
                    value={geoBoundaries}
                    onChange={setGeoBoundaries}
                    placeholder="Speak for at least 30 seconds"
                  />
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

export default IntakeForm;
