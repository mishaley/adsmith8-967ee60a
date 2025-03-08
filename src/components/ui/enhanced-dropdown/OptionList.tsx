
import React from "react";
import { OptionListProps } from "./types";
import OptionRenderer from "./OptionRenderer";

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
              : <OptionRenderer 
                  option={option} 
                  isSelected={selectedItems.includes(option.id)} 
                  isHighlighted={highlightedIndex === index}
                  multiSelect={multiSelect}
                />}
          </div>
        ))
      )}
    </div>
  );
};

export default OptionList;
