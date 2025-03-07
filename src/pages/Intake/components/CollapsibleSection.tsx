
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorageUtils";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  className = "bg-[#e9f2fe] p-4 mb-6 rounded-lg"
}) => {
  // Create a unique key for this section in localStorage
  const storageKey = `${STORAGE_KEYS.SECTION_STATES}_${title.toLowerCase().replace(/\s+/g, '_')}`;
  
  // Initialize state from localStorage or default to not collapsed
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = loadFromLocalStorage<boolean | null>(storageKey, null);
    // Only return the saved state if it's a boolean
    return typeof savedState === 'boolean' ? savedState : false;
  });

  // Update localStorage when state changes
  useEffect(() => {
    saveToLocalStorage(storageKey, isCollapsed);
  }, [isCollapsed, storageKey]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={className}>
      <div
        className="flex justify-between items-center cursor-pointer py-2"
        onClick={toggleCollapse}
        role="button"
        tabIndex={0}
        aria-expanded={!isCollapsed}
      >
        <h2 className="text-center w-full text-gray-700 font-bold text-xl">
          {title}
        </h2>
        <div className="flex-shrink-0">
          {isCollapsed ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>
      
      <div 
        className={`overflow-visible transition-all duration-300 ${
          isCollapsed ? 'max-h-0 opacity-0 mt-0 overflow-hidden' : 'max-h-[5000px] opacity-100 mt-2'
        }`}
        style={{ position: 'relative' }}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection;
