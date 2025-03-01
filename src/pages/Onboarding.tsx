
import React, { useState } from "react";
import QuadrantLayout from "@/components/QuadrantLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [offering, setOffering] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  
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
                      <div className="w-64 relative">
                        <div className="relative">
                          <Textarea
                            value={sellingPoints}
                            onChange={(e) => setSellingPoints(e.target.value)}
                            className="min-h-[100px] w-full pr-3 pl-3 pt-3"
                            style={{ paddingBottom: "40px" }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center h-10 bg-transparent">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="bg-white/80 text-sm text-gray-500 cursor-pointer w-full mx-2 mb-1"
                            >
                              <Mic size={18} className="text-blue-500 mr-1" />
                              Hold to talk <ArrowRight size={14} className="ml-1" />
                            </Button>
                          </div>
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
