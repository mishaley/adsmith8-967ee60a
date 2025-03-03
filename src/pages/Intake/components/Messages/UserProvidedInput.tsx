
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
        className="w-full h-9 rounded-l-none border-l-0 -ml-[1px] border-[#0c343d] focus:border-[#0c343d] focus-visible:ring-[#0c343d]"
        placeholder="Enter your message"
      />
    </div>
  );
};

export default UserProvidedInput;
