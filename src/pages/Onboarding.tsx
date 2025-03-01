
import React from "react";
import QuadrantLayout from "@/components/QuadrantLayout";

const Onboarding = () => {
  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-4">Onboarding</h1>
            <p className="mb-4">
              Welcome to the onboarding page. This is where users can get started with the platform.
            </p>
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Onboarding;
