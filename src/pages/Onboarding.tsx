
import React, { useState } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { Input } from "@/components/ui/input";

const Onboarding = () => {
  const [brandName, setBrandName] = useState("");
  
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
                    <td className="py-4 pr-4 text-lg w-auto">What's your brand name?</td>
                    <td className="py-4">
                      <Input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full"
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 pr-4 text-lg"></td>
                    <td className="py-4"></td>
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
