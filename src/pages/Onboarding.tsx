
import React from "react";
import QuadrantLayout from "@/components/QuadrantLayout";

const Onboarding = () => {
  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="w-full">
            <p className="text-lg mb-4">Welcome to Adsmith! Your marketing ROI is our only focus.</p>
            <p className="text-lg mb-4">
              Let's get a demo campaign set up. It'll only take a few minutes.
            </p>
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Onboarding;
