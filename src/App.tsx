import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ExpenseList } from './components/ExpenseList';
import { ChoreTracker } from './components/ChoreTracker';
import { Settings } from './components/Settings';
import { generateId, getCurrentMonth, isNewMonth } from './utils/helpers';
import type { Expense, MonthlyBudget, Chore, Roommate } from './types';
import { auth, provider } from './firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  addExpense,
  deleteExpense,
  setMonthlyBudget,
  getBudgetDoc,
  addChore,
  deleteChore,
  addRoommate,
  deleteRoommate,
  userCollection,
} from './lib/firestore';
import {
  onSnapshot,
  getDoc,
  query,
  collection,
} from 'firebase/firestore';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudget, setMonthlyBudgetState] = useState<MonthlyBudget | null>(null);
  const [chores, setChores] = useState<Chore[]>([]);
  const [roommates, setRoommates] = useState<Roommate[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubExpenses = onSnapshot(
      userCollection(user.uid, 'expenses'),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Expense[];
        setExpenses(data);
      }
    );

    const unsubChores = onSnapshot(
      userCollection(user.uid, 'chores'),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Chore[];
        setChores(data);
      }
    );

    const unsubRoommates = onSnapshot(
      userCollection(user.uid, 'roommates'),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Roommate[];
        setRoommates(data);
      }
    );

    getDoc(getBudgetDoc(user.uid)).then((docSnap) => {
      if (docSnap.exists()) {
        const storedBudget = docSnap.data() as MonthlyBudget;

        if (isNewMonth(storedBudget.month)) {
          onSnapshot(userCollection(user.uid, 'expenses'), (snap) => {
            snap.docs.forEach((doc) => deleteExpense(user.uid, doc.id));
          });

          onSnapshot(userCollection(user.uid, 'chores'), (snap) => {
            snap.docs.forEach((doc) => deleteChore(user.uid, doc.id));
          });

          const newBudget: MonthlyBudget = {
            ...storedBudget,
            month: new Date().toISOString().slice(0, 7),
            totalAmount: 0,
            isActive: true,
            setDate: new Date().toISOString().split('T')[0],
          };

          setMonthlyBudget(user.uid, newBudget);
          toast.success('🎉 New month started. Last month\'s data cleared.');
        }

        setMonthlyBudgetState(storedBudget);
      }
    });

    return () => {
      unsubExpenses();
      unsubChores();
      unsubRoommates();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddExpense = async (data: Omit<Expense, 'id' | 'date'>) => {
    await addExpense(user.uid, {
      ...data,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(user.uid, id);
  };

  const handleSetBudget = async (amount: number) => {
    await setMonthlyBudget(user.uid, {
      id: generateId(),
      month: getCurrentMonth(),
      year: new Date().getFullYear(),
      totalAmount: amount,
      setDate: new Date().toISOString().split('T')[0],
      isActive: true,
    });
    toast.success('Budget updated');
  };

  const handleResetBudget = () => {
    setMonthlyBudgetState(null);
  };

  const handleAddChore = async (data: Omit<Chore, 'id'>) => {
    await addChore(user.uid, data);
  };

  const handleCompleteChore = async (id: string) => {
    const updated = chores.find((c) => c.id === id);
    if (updated) {
      await addChore(user.uid, { ...updated, completed: true });
    }
  };

  const handleDeleteChore = async (id: string) => {
    await deleteChore(user.uid, id);
  };

  const handleAddRoommate = async (data: Omit<Roommate, 'id' | 'totalSpent' | 'chorePoints'>) => {
    await addRoommate(user.uid, {
      ...data,
      totalSpent: 0,
      chorePoints: 0,
    });
  };

  const handleRemoveRoommate = async (id: string) => {
    await deleteRoommate(user.uid, id);
  };

  const handleClearData = async () => {
    setExpenses([]);
    setChores([]);
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
        return <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />;
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
      <div style={{ padding: '1rem', textAlign: 'right' }}>
        {user ? (
          <button onClick={handleLogout}>Logout ({user.displayName})</button>
        ) : (
          <button onClick={handleLogin}>Login with Google</button>
        )}
      </div>

      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;