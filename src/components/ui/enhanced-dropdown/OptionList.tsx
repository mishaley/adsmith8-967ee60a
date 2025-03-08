
import React from "react";
import { Check } from "lucide-react";
import { OptionListProps, DropdownOption } from "./types";

const OptionList: React.FC<OptionListProps> = ({
  filteredOptions,
  selectedItems,
  highlightedIndex,
  setHighlightedIndex,
  onSelect,
  multiSelect,
  renderOption,
  listRef,
}) => {
  // Default option renderer
  const defaultRenderOption = (option: DropdownOption, isSelected: boolean, isHighlighted: boolean) => (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        {multiSelect && (
          <div className={`flex items-center justify-center w-5 h-5 mr-1 border rounded ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
        )}
        {typeof option.icon === 'string' ? (
          <span className="inline-block w-6 text-center">{option.icon}</span>
        ) : option.icon ? (
          option.icon
        ) : null}
        <span className="truncate">{option.label}</span>
      </div>
      {option.secondary && (
        <span className="text-gray-500 truncate">{option.secondary}</span>
      )}
    </div>
  );

  return (
    <div 
      ref={listRef}
      className="overflow-y-auto"
      style={{ maxHeight: '250px' }}
      role="listbox"
      aria-multiselectable={multiSelect}
    >
      {filteredOptions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No options found</div>
      ) : (
        filteredOptions.map((option, index) => (
          <div
            key={option.id}
            className={`
              cursor-pointer
              ${selectedItems.includes(option.id) ? 'bg-gray-100' : ''}
              ${highlightedIndex === index ? 'bg-gray-100' : ''}
              hover:bg-gray-100
            `}
            onClick={() => onSelect(option.id)}
            onMouseEnter={() => setHighlightedIndex(index)}
            role="option"
            aria-selected={selectedItems.includes(option.id)}
          >
            {renderOption 
              ? renderOption(option, selectedItems.includes(option.id), highlightedIndex === index) 
              : defaultRenderOption(option, selectedItems.includes(option.id), highlightedIndex === index)}
          </div>
        ))
      )}
    </div>
  );
};

export default OptionList;
