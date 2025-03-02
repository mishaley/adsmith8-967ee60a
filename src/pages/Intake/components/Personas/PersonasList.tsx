
import React from "react";
import { Persona } from "./types";

interface PersonasListProps {
  personas: Persona[];
}

const PersonasList: React.FC<PersonasListProps> = ({ personas }) => {
  // Always render 5 columns, populated with personas data when available
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, index) => (
        <td key={index} className="py-3 px-3 border-r align-top" style={{ width: "20%" }}>
          {personas[index] ? (
            <div className="flex flex-col">
              <div className="font-medium">{personas[index].title}</div>
              <div>{personas[index].gender}, age {personas[index].ageMin}-{personas[index].ageMax}</div>
              <div>{personas[index].interests.join(", ")}</div>
            </div>
          ) : (
            <div className="text-gray-400">No persona data</div>
          )}
        </td>
      ))}
    </tr>
  );
};

export default PersonasList;
