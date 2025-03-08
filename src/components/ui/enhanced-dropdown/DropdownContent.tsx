
import React from "react";
import { Portal } from "@radix-ui/react-portal";
import { DropdownContentProps } from "./types";

const DropdownContent: React.FC<DropdownContentProps> = ({
  contentRef,
  contentPosition,
  onKeyDown,
  contentClassName,
  children,
}) => {
  return (
    <Portal>
      <div 
        ref={contentRef}
        className={`fixed bg-white border border-gray-200 rounded-md shadow-lg z-[100] ${contentClassName}`}
        style={{
          top: `${contentPosition.top}px`,
          left: `${contentPosition.left}px`,
          width: `${contentPosition.width}px`,
          maxHeight: '400px'
        }}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    </Portal>
  );
};

export default DropdownContent;
