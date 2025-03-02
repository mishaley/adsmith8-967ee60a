
export interface Persona {
  id?: string;
  name?: string;
  title: string;
  gender: string;
  ageMin: number;
  ageMax: number;
  interests: string[];
  portraitUrl?: string;
  race?: string;
}
