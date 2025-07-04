import React, { useState } from 'react';
import { Card } from './Card';
import { ExpenseForm } from './ExpenseForm';
import { formatCurrency, getCurrentMonth, getMonthProgress } from '../utils/helpers';
import { PlusCircle, TrendingDown, Users, Calendar, AlertTriangle, Target } from 'lucide-react';
import type { Expense, MonthlyBudget, Roommate } from '../types';

interface DashboardProps {
  monthlyBudget: MonthlyBudget | null;
  expenses: Expense[];
  roommates: Roommate[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onSetBudget: (amount: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  monthlyBudget,
  expenses,
  roommates,
  onAddExpense,
  onSetBudget,
}) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingAmount = monthlyBudget ? monthlyBudget.totalAmount - totalSpent : 0;
  const spentPercentage = monthlyBudget ? (totalSpent / monthlyBudget.totalAmount) * 100 : 0;
  const monthProgress = getMonthProgress();

  const recentExpenses = expenses.slice(-3).reverse();

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(budgetAmount);
    if (amount > 0) {
      onSetBudget(amount);
      setBudgetAmount('');
      setShowBudgetForm(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card glass hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {monthlyBudget ? formatCurrency(monthlyBudget.totalAmount) : '₹0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </Card>

        <Card glass hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card glass hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</p>
              <p className={`text-2xl font-bold ${remainingAmount < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {formatCurrency(remainingAmount)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              remainingAmount < 0 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : 'bg-emerald-100 dark:bg-emerald-900/30'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${
                remainingAmount < 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-emerald-600 dark:text-emerald-400'
              }`} />
            </div>
          </div>
        </Card>

        <Card glass hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Roommates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {roommates.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Progress & Month Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Progress</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {spentPercentage.toFixed(1)}% used
            </span>
          </div>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  spentPercentage > 90 ? 'bg-red-500' : 
                  spentPercentage > 70 ? 'bg-amber-500' : 'bg-primary-500'
                }`}
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>₹0</span>
              <span>{monthlyBudget ? formatCurrency(monthlyBudget.totalAmount) : '₹0'}</span>
            </div>
          </div>
        </Card>

        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Month Progress</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {monthProgress}% complete
            </span>
          </div>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${monthProgress}%` }}
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{getCurrentMonth()}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setShowExpenseForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 
                     text-white rounded-xl font-medium hover:from-primary-600 hover:to-emerald-600 
                     transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Expense</span>
        </button>

        {!monthlyBudget && (
          <button
            onClick={() => setShowBudgetForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-dark-800 
                       text-gray-700 dark:text-gray-300 rounded-xl font-medium border 
                       border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700
                       transition-all duration-300"
          >
            <Target className="w-5 h-5" />
            <span>Set Monthly Budget</span>
          </button>
        )}
      </div>

      {/* Recent Expenses Preview */}
      {recentExpenses.length > 0 && (
        <Card glass className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 
                                              bg-gray-50 dark:bg-dark-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    by {expense.spentBy} • {expense.category}
                  </p>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 w-full max-w-md">
            <ExpenseForm
              roommates={roommates}
              onSubmit={(expense) => {
                onAddExpense(expense);
                setShowExpenseForm(false);
              }}
              onCancel={() => setShowExpenseForm(false)}
            />
          </div>
        </div>
      )}

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Set Monthly Budget
            </h3>
            <form onSubmit={handleSetBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                           rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                  placeholder="Enter monthly budget"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-medium
                           hover:bg-primary-600 transition-colors duration-200"
                >
                  Set Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowBudgetForm(false)}
                  className="flex-1 bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 
                           py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-dark-500
                           transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};