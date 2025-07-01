export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getCurrentMonth = (): string => {
  return new Date().toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
};

export const getMonthProgress = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const progress = (now.getTime() - start.getTime()) / (end.getTime() - start.getTime());
  return Math.round(progress * 100);
};

// ✅ New helper to check if month has changed
export const isNewMonth = (storedMonth: string): boolean => {
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g., '2025-07'
  return currentMonth !== storedMonth;
};
