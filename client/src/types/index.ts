export interface StudentData {
  fullName: string;
  rollNumber: string;
  classGrade: string;
  division: string;
  allergies: string[];
  rackNumber?: string;
  busRoute?: string;
  photo: string;
  template: 'classic' | 'modern';
  createdAt: string;
}

export interface CardData extends StudentData {
  id: number;
}
