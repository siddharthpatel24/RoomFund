import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ExpenseList } from './components/ExpenseList';
import { ChoreTracker } from './components/ChoreTracker';
import { Settings } from './components/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateId, getCurrentMonth } from './utils/helpers';
import type { Expense, MonthlyBudget, Chore, Roommate } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data state with localStorage persistence
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [monthlyBudget, setMonthlyBudget] = useLocalStorage<MonthlyBudget | null>('monthlyBudget', null);
  const [chores, setChores] = useLocalStorage<Chore[]>('chores', []);
  const [roommates, setRoommates] = useLocalStorage<Roommate[]>('roommates', [
    { id: '1', name: 'You (Admin)', isAdmin: true, totalSpent: 0, chorePoints: 0, initials: 'YA' }
  ]);

  // Expense handlers
  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses(prev => [...prev, newExpense]);
    toast.success('Expense added successfully!');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast.success('Expense deleted');
  };

  // Budget handlers
  const handleSetBudget = (amount: number) => {
    const newBudget: MonthlyBudget = {
      id: generateId(),
      month: getCurrentMonth(),
      year: new Date().getFullYear(),
      totalAmount: amount,
      setDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    setMonthlyBudget(newBudget);
    toast.success(`Monthly budget set to ₹${amount.toLocaleString()}`);
  };

  const handleResetBudget = () => {
    setMonthlyBudget(null);
    toast.success('Budget reset');
  };

  // Chore handlers
  const handleAddChore = (choreData: Omit<Chore, 'id'>) => {
    const newChore: Chore = {
      ...choreData,
      id: generateId(),
    };
    setChores(prev => [...prev, newChore]);
    toast.success('Chore added successfully!');
  };

  const handleCompleteChore = (id: string) => {
    setChores(prev => prev.map(chore => 
      chore.id === id ? { ...chore, completed: true } : chore
    ));
    toast.success('Chore completed! 🎉');
  };

  const handleDeleteChore = (id: string) => {
    setChores(prev => prev.filter(chore => chore.id !== id));
    toast.success('Chore deleted');
  };

  // Roommate handlers
  const handleAddRoommate = (roommateData: Omit<Roommate, 'id' | 'totalSpent' | 'chorePoints'>) => {
    const newRoommate: Roommate = {
      ...roommateData,
      id: generateId(),
      totalSpent: 0,
      chorePoints: 0,
    };
    setRoommates(prev => [...prev, newRoommate]);
    toast.success(`${roommateData.name} added as roommate`);
  };

  const handleRemoveRoommate = (id: string) => {
    const roommate = roommates.find(r => r.id === id);
    if (roommate?.isAdmin) {
      toast.error('Cannot remove admin user');
      return;
    }
    setRoommates(prev => prev.filter(r => r.id !== id));
    toast.success('Roommate removed');
  };

  // Data management
  const handleClearData = () => {
    setExpenses([]);
    setChores([]);
    toast.success('All data cleared');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            monthlyBudget={monthlyBudget}
            expenses={expenses}
            roommates={roommates}
            onAddExpense={handleAddExpense}
            onSetBudget={handleSetBudget}
          />
        );
      case 'expenses':
        return (
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'chores':
        return (
          <ChoreTracker
            chores={chores}
            roommates={roommates}
            onAddChore={handleAddChore}
            onCompleteChore={handleCompleteChore}
            onDeleteChore={handleDeleteChore}
          />
        );
      case 'settings':
        return (
          <Settings
            roommates={roommates}
            monthlyBudget={monthlyBudget}
            expenses={expenses}
            onAddRoommate={handleAddRoommate}
            onRemoveRoommate={handleRemoveRoommate}
            onClearData={handleClearData}
            onResetBudget={handleResetBudget}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </>
  );
}

export default App;