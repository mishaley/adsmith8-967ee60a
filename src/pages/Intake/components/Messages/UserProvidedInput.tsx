
import React from "react";
import { Input } from "@/components/ui/input";

interface UserProvidedInputProps {
  userProvidedMessage: string;
  setUserProvidedMessage: (message: string) => void;
  isUserProvidedSelected: boolean;
}

const UserProvidedInput: React.FC<UserProvidedInputProps> = ({
  userProvidedMessage,
  setUserProvidedMessage,
  isUserProvidedSelected
}) => {
  if (!isUserProvidedSelected) return null;
  
  return (
    <div className="w-60 flex items-start">
      <Input
        type="text"
        value={userProvidedMessage}
        onChange={(e) => setUserProvidedMessage(e.target.value)}
        className="w-full h-9 rounded-l-none border-l-0 -ml-[1px] border-[#e9f2fe] focus:border-[#e9f2fe] focus-visible:ring-[#e9f2fe]"
      />
    </div>
  );
};

export default UserProvidedInput;
