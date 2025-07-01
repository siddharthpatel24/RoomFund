import React, { useState } from 'react';
import { X, Upload, User } from 'lucide-react';
import type { Roommate } from '../types';

interface ExpenseFormProps {
  roommates: Roommate[];
  onSubmit: (expense: {
    amount: number;
    description?: string;
    spentBy?: string;
    category?: string;
  }) => void;
  onCancel: () => void;
}

const categories = [
  'Food & Groceries',
  'Utilities',
  'Rent',
  'Transportation',
  'Entertainment',
  'Household Items',
  'Other',
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  roommates,
  onSubmit,
  onCancel,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [spentBy, setSpentBy] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount) {
      onSubmit({
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        spentBy: spentBy || undefined,
        category: category || undefined,
      });
    }
  };

  const getRoommateAvatar = (roommate: Roommate) => {
    if (roommate.avatar) {
      return (
        <img
          src={roommate.avatar}
          alt={roommate.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    
    const initials = roommate.initials || roommate.name.charAt(0).toUpperCase();
    return (
      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-emerald-500 
                      rounded-full flex items-center justify-center text-white font-semibold text-sm">
        {initials}
      </div>
    );
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Expense</h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                     rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                     rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            placeholder="What was this expense for?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Spent by <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            value={spentBy}
            onChange={(e) => setSpentBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                     rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
          >
            <option value="">Select roommate (optional)</option>
            {roommates.map((roommate) => (
              <option key={roommate.id} value={roommate.name}>
                {roommate.name}
              </option>
            ))}
          </select>
          
          {/* Visual roommate selector */}
          <div className="mt-3 flex flex-wrap gap-2">
            {roommates.map((roommate) => (
              <button
                key={roommate.id}
                type="button"
                onClick={() => setSpentBy(roommate.name)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200
                          ${spentBy === roommate.name 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-gray-300 dark:border-dark-600 hover:border-primary-300'
                          }`}
              >
                {getRoommateAvatar(roommate)}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {roommate.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                     rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
          >
            <option value="">Select category (optional)</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-primary-500 to-emerald-500 text-white 
                     py-3 rounded-xl font-medium hover:from-primary-600 hover:to-emerald-600 
                     transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Add Expense
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 
                     py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-dark-500
                     transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};