
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
    <div className="w-60 mr-4">
      <Input
        type="text"
        placeholder="Enter your custom message here..."
        value={userProvidedMessage}
        onChange={(e) => setUserProvidedMessage(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default UserProvidedInput;
