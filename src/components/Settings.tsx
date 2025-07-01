import React, { useState } from 'react';
import { Card } from './Card';
import { Users, Shield, Trash2, Plus, Download, Upload, Camera } from 'lucide-react';
import type { Roommate, MonthlyBudget, Expense } from '../types';
import { formatCurrency } from '../utils/helpers';

interface SettingsProps {
  roommates: Roommate[];
  monthlyBudget: MonthlyBudget | null;
  expenses: Expense[];
  onAddRoommate: (roommate: Omit<Roommate, 'id' | 'totalSpent' | 'chorePoints'>) => void;
  onRemoveRoommate: (id: string) => void;
  onClearData: () => void;
  onResetBudget: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  roommates,
  monthlyBudget,
  expenses,
  onAddRoommate,
  onRemoveRoommate,
  onClearData,
  onResetBudget,
}) => {
  const [showAddRoommate, setShowAddRoommate] = useState(false);
  const [newRoommate, setNewRoommate] = useState({ 
    name: '', 
    isAdmin: false, 
    avatar: '',
    initials: ''
  });

  const handleAddRoommate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoommate.name.trim()) {
      const initials = newRoommate.initials.trim() || 
                      newRoommate.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      
      onAddRoommate({
        ...newRoommate,
        name: newRoommate.name.trim(),
        initials,
        avatar: newRoommate.avatar.trim() || undefined,
      });
      setNewRoommate({ name: '', isAdmin: false, avatar: '', initials: '' });
      setShowAddRoommate(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setNewRoommate(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateReport = () => {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = monthlyBudget ? monthlyBudget.totalAmount - totalSpent : 0;
    
    const reportData = {
      month: monthlyBudget?.month || 'Current Month',
      budget: monthlyBudget?.totalAmount || 0,
      totalSpent,
      remaining,
      expenses: expenses.map(expense => ({
        date: expense.date,
        description: expense.description || 'No description',
        amount: expense.amount,
        spentBy: expense.spentBy || 'Unknown',
        category: expense.category || 'Uncategorized',
      })),
      roommateBreakdown: roommates.map(roommate => ({
        name: roommate.name,
        totalSpent: expenses
          .filter(expense => expense.spentBy === roommate.name)
          .reduce((sum, expense) => sum + expense.amount, 0),
      })),
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const getRoommateAvatar = (roommate: Roommate) => {
    if (roommate.avatar) {
      return (
        <img
          src={roommate.avatar}
          alt={roommate.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    
    const initials = roommate.initials || roommate.name.charAt(0).toUpperCase();
    return (
      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-emerald-500 
                      rounded-full flex items-center justify-center text-white font-semibold">
        {initials}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage roommates and app preferences</p>
      </div>

      {/* Roommate Management */}
      <Card glass className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Roommates</h3>
          </div>
          <button
            onClick={() => setShowAddRoommate(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white 
                     rounded-lg font-medium hover:bg-primary-600 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Roommate</span>
          </button>
        </div>

        <div className="space-y-3">
          {roommates.map((roommate) => {
            const totalSpent = expenses
              .filter(expense => expense.spentBy === roommate.name)
              .reduce((sum, expense) => sum + expense.amount, 0);

            return (
              <div key={roommate.id} className="flex items-center justify-between p-4 
                                              bg-gray-50 dark:bg-dark-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getRoommateAvatar(roommate)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{roommate.name}</span>
                      {roommate.isAdmin && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-primary-100 
                                       dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 
                                       rounded text-xs">
                          <Shield className="w-3 h-3" />
                          <span>Admin</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total spent: {formatCurrency(totalSpent)}
                    </p>
                  </div>
                </div>
                {!roommate.isAdmin && (
                  <button
                    onClick={() => onRemoveRoommate(roommate.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 
                             rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Data Management */}
      <Card glass className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Export Report</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download a detailed expense report as JSON
              </p>
            </div>
            <button
              onClick={generateReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white 
                       rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Reset Monthly Budget</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Clear current budget to set a new one
              </p>
            </div>
            <button
              onClick={onResetBudget}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium 
                       hover:bg-amber-600 transition-colors duration-200"
            >
              Reset Budget
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Clear All Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remove all expenses and chores (keeps roommates)
              </p>
            </div>
            <button
              onClick={onClearData}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white 
                       rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Data</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Add Roommate Modal */}
      {showAddRoommate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Roommate
            </h3>
            <form onSubmit={handleAddRoommate} className="space-y-4">
              {/* Avatar Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  {newRoommate.avatar ? (
                    <img
                      src={newRoommate.avatar}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-emerald-500 
                                    rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                      {newRoommate.initials || newRoommate.name.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 rounded-full 
                                   flex items-center justify-center cursor-pointer hover:bg-primary-600 
                                   transition-colors duration-200">
                    <Camera className="w-3 h-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Click camera icon to upload photo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newRoommate.name}
                  onChange={(e) => setNewRoommate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                           rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                  placeholder="Enter roommate's name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Initials (optional)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={newRoommate.initials}
                  onChange={(e) => setNewRoommate(prev => ({ ...prev, initials: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                           rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                  placeholder="e.g., AB"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Will auto-generate from name if not provided
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={newRoommate.isAdmin}
                  onChange={(e) => setNewRoommate(prev => ({ ...prev, isAdmin: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded 
                           focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 
                           focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Make admin (can manage budget and settings)
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-medium
                           hover:bg-primary-600 transition-colors duration-200"
                >
                  Add Roommate
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRoommate(false)}
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