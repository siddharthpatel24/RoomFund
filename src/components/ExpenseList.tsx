import React, { useState } from 'react';
import { Card } from './Card';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Search, Filter, Trash2, Calendar, User, Tag } from 'lucide-react';
import type { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRoommate, setSelectedRoommate] = useState('');

  const categories = Array.from(new Set(expenses.map(e => e.category).filter(Boolean)));
  const roommates = Array.from(new Set(expenses.map(e => e.spentBy).filter(Boolean)));

  const filteredExpenses = expenses.filter(expense => {
    const description = expense.description || '';
    const category = expense.category || '';
    const spentBy = expense.spentBy || '';
    
    const matchesSearch = description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || category === selectedCategory;
    const matchesRoommate = !selectedRoommate || spentBy === selectedRoommate;
    return matchesSearch && matchesCategory && matchesRoommate;
  });

  const totalFiltered = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredExpenses.length} expenses • Total: {formatCurrency(totalFiltered)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card glass className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 
                       rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 
                       rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       bg-white dark:bg-dark-700 text-gray-900 dark:text-white appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedRoommate}
              onChange={(e) => setSelectedRoommate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 
                       rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       bg-white dark:bg-dark-700 text-gray-900 dark:text-white appearance-none"
            >
              <option value="">All Roommates</option>
              {roommates.map((roommate) => (
                <option key={roommate} value={roommate}>
                  {roommate}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Expense List */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <Card glass className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No expenses found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedCategory || selectedRoommate 
                ? 'Try adjusting your filters to see more results.'
                : 'Start by adding your first expense!'
              }
            </p>
          </Card>
        ) : (
          filteredExpenses.map((expense) => (
            <Card key={expense.id} glass hover className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {expense.description || 'No description'}
                    </h3>
                    {expense.category && (
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 
                                     dark:text-primary-300 rounded-full text-sm font-medium">
                        {expense.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                    {expense.spentBy && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{expense.spentBy}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 
                             rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};