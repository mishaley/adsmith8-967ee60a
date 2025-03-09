
import { ReactNode, RefObject } from "react";

export interface DropdownOption {
  id: string;
  label: string;
  icon?: string | ReactNode;
  secondary?: string;
  [key: string]: any;
}

export interface EnhancedDropdownProps {
  options: DropdownOption[];
  selectedItems: string[] | string | null | undefined;
  onSelectionChange: (selectedIds: string[]) => void;
  placeholder?: string;
  buttonIcon?: ReactNode;
  multiSelect?: boolean;
  searchPlaceholder?: string;
  clearButtonText?: string;
  renderOption?: (option: DropdownOption, isSelected: boolean, isHighlighted: boolean) => ReactNode;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export interface TriggerButtonProps {
  placeholder: string;
  buttonIcon?: ReactNode;
  selectedOptionLabels: DropdownOption[];
  multiSelect: boolean;
  onToggle: () => void;
  disabled: boolean;
  buttonClassName: string;
}

export interface DropdownContentProps {
  children: ReactNode;
  contentRef: RefObject<HTMLDivElement>;
  contentPosition: { top: number; left: number; width: number };
  onKeyDown: (event: React.KeyboardEvent) => void;
  contentClassName?: string;
}

export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchPlaceholder: string;
  inputRef: RefObject<HTMLInputElement>;
}

export interface OptionListProps {
  filteredOptions: DropdownOption[];
  selectedItems: string[] | string | null | undefined;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  onSelect: (id: string) => void;
  multiSelect: boolean;
  renderOption?: (option: DropdownOption, isSelected: boolean, isHighlighted: boolean) => ReactNode;
  listRef: RefObject<HTMLDivElement>;
}

export interface OptionRendererProps {
  option: DropdownOption;
  isSelected: boolean;
  isHighlighted: boolean;
  multiSelect: boolean;
}

export interface ClearButtonProps {
  selectedItems: string[] | string | null | undefined;
  onClear: () => void;
  clearButtonText: string;
}

export interface UseKeyboardNavigationProps {
  isOpen: boolean;
  filteredOptions: DropdownOption[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  handleSelect: (id: string) => void;
  setSearchTerm: (term: string) => void;
  listRef: RefObject<HTMLDivElement>;
}
