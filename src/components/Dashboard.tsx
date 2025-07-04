// src/components/Dashboard.tsx

import React from 'react';
import { formatCurrency } from '../utils/helpers';
import type { Expense, MonthlyBudget, Roommate } from '../types';

interface DashboardProps {
  expenses: Expense[];
  monthlyBudget: MonthlyBudget | null;
  roommates: Roommate[];
  onAddExpense: (data: Omit<Expense, 'id' | 'date'>) => void;
  onSetBudget: (amount: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  expenses,
  monthlyBudget,
  roommates,
  onAddExpense,
  onSetBudget,
}) => {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = monthlyBudget ? monthlyBudget.totalAmount - totalSpent : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Monthly Budget</h2>
        {monthlyBudget ? (
          <>
            <p>Total: {formatCurrency(monthlyBudget.totalAmount)}</p>
            <p>Spent: {formatCurrency(totalSpent)}</p>
            <p className="text-green-600 font-semibold">
              Remaining: {formatCurrency(remaining)}
            </p>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              const amount = parseFloat(prompt('Enter monthly budget') || '0');
              if (amount > 0) onSetBudget(amount);
            }}
          >
            Set Monthly Budget
          </button>
        )}
      </div>

      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Add Expense</h2>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => {
            const title = prompt('What did you buy?');
            const amount = parseFloat(prompt('How much did it cost?') || '0');
            const category = prompt('What category? (e.g. food, electricity)') || 'other';
            if (title && amount > 0 && category) {
              onAddExpense({ title, amount, category });
            }
          }}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};
