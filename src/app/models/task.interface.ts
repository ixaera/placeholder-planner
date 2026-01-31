export interface Task {
  id: number;
  text: string;
  completed: boolean;
  tags?: string[];
  showTagInput?: boolean;
}

export interface Goal {
  id: number;
  text: string;
  completed: boolean;
  tags?: string[];
  showTagInput?: boolean;
}
