
import React, { useEffect, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUserProvidedSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUserProvidedSelected]);

  if (!isUserProvidedSelected) return null;
  
  return (
    <div className="w-60 flex items-start">
      <Input
        ref={inputRef}
        type="text"
        value={userProvidedMessage}
        onChange={(e) => setUserProvidedMessage(e.target.value)}
        className="w-full h-9 rounded-l-none border-l-0 -ml-[1px] focus:outline-none focus:ring-0 focus:border-transparent"
        autoFocus
        style={{ border: "none", boxShadow: "none" }}
      />
    </div>
  );
};

export default UserProvidedInput;
