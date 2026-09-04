export interface Task {
  id: string;
  subjectId: string | null;
  title: string;
  dueDate: string;
  done: boolean;
  createdAt: string;
}
