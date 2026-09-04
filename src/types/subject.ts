export interface Subject {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  isCustom: boolean;
  createdAt: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  order: number;
  createdAt: string;
}
