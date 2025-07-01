export interface Expense {
  id: string;
  amount: number;
  description?: string;
  spentBy?: string;
  date: string;
  category?: string;
}

export interface MonthlyBudget {
  id: string;
  month: string;
  year: number;
  totalAmount: number;
  setDate: string;
  isActive: boolean;
}

export interface Chore {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  points: number;
  emoji: string;
}

export interface Roommate {
  id: string;
  name: string;
  isAdmin: boolean;
  totalSpent: number;
  chorePoints: number;
  avatar?: string;
  initials?: string;
}

export type ThemeMode = 'light' | 'dark';