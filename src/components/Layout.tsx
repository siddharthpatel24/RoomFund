import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Wallet, Users, CheckSquare, BarChart3, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Wallet },
  { id: 'expenses', label: 'Expenses', icon: BarChart3 },
  { id: 'chores', label: 'Chores', icon: CheckSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 
                    dark:from-dark-900 dark:via-dark-800 dark:to-slate-900 transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/30 dark:bg-dark-900/30 
                         border-b border-white/20 dark:border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-emerald-600 
                              rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 
                               dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  RoomExpense
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Premium Expense Tracker</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-16 z-40 backdrop-blur-xl bg-white/20 dark:bg-dark-800/20 
                      border-b border-white/10 dark:border-dark-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium 
                            border-b-2 transition-all duration-300 whitespace-nowrap
                            ${isActive 
                              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};