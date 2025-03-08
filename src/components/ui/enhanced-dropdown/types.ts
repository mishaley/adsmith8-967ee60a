
import React from "react";

export interface DropdownOption {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  secondary?: string;
}

export interface CommonDropdownProps {
  className?: string;
  disabled?: boolean;
}

export interface TriggerButtonProps extends CommonDropdownProps {
  placeholder: string;
  buttonIcon?: React.ReactNode;
  selectedOptionLabels: DropdownOption[];
  multiSelect: boolean;
  onToggle: () => void;
  isOpen: boolean;
  buttonClassName: string;
}

export interface SearchBarProps extends CommonDropdownProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchPlaceholder: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

export interface OptionListProps extends CommonDropdownProps {
  filteredOptions: DropdownOption[];
  selectedItems: string[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  onSelect: (id: string) => void;
  multiSelect: boolean;
  renderOption?: (option: DropdownOption, isSelected: boolean, isHighlighted: boolean) => React.ReactNode;
  listRef: React.RefObject<HTMLDivElement>;
}

export interface ClearButtonProps extends CommonDropdownProps {
  selectedItems: string[];
  onClear: () => void;
  clearButtonText: string;
}

export interface DropdownContentProps extends CommonDropdownProps {
  contentRef: React.RefObject<HTMLDivElement>;
  contentPosition: { top: number; left: number; width: number };
  onKeyDown: (e: React.KeyboardEvent) => void;
  contentClassName: string;
  children: React.ReactNode;
}

export interface EnhancedDropdownProps {
  options: DropdownOption[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  placeholder?: string;
  buttonIcon?: React.ReactNode;
  multiSelect?: boolean;
  searchPlaceholder?: string;
  clearButtonText?: string;
  renderOption?: (option: DropdownOption, isSelected: boolean, isHighlighted: boolean) => React.ReactNode;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}
