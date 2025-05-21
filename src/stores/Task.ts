export interface TaskType {
  id: string;
  name: string;
  isCompleted: boolean;
  createdAt: Date;
  seqNo: number;
}

export interface TaskListType {
  id: string;
  name: string;
  tasks: TaskType[];
}