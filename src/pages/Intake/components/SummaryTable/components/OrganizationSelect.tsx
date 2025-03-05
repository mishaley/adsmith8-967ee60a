
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";

interface OrganizationSelectProps {
  selectedOrgId: string;
  organizations: Array<{
    organization_id: string;
    organization_name: string;
  }>;
  onValueChange: (value: string) => void;
}

const OrganizationSelect: React.FC<OrganizationSelectProps> = ({
  selectedOrgId,
  organizations,
  onValueChange,
}) => {
  return (
    <Select value={selectedOrgId} onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent className="bg-white min-w-[var(--radix-select-trigger-width)] w-fit">
        {organizations.map((org) => (
          <SelectItem 
            key={org.organization_id}
            value={org.organization_id}
          >
            {org.organization_name}
          </SelectItem>
        ))}
        <SelectSeparator className="my-1" />
        <SelectItem value="clear-selection" className="text-gray-500">
          Clear
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default OrganizationSelect;
