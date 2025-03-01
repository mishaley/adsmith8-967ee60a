
import React from "react";
import { Persona } from "./types";

interface PersonasListProps {
  personas: Persona[];
}

const PersonasList: React.FC<PersonasListProps> = ({ personas }) => {
  return (
    <tr>
      {personas.length > 0 ? (
        personas.map((persona, index) => (
          <td key={index} className="py-3 px-3 border-r align-top" style={{ width: "20%" }}>
            <div className="flex flex-col">
              <div className="font-medium">{persona.title}</div>
              <div>{persona.gender}, age {persona.ageMin}-{persona.ageMax}</div>
              <div>{persona.interests.join(", ")}</div>
            </div>
          </td>
        ))
      ) : (
        Array.from({ length: 5 }).map((_, index) => (
          <td key={index} className="py-4 px-2 border-r" style={{ width: "20%" }}></td>
        ))
      )}
    </tr>
  );
};

export default PersonasList;
