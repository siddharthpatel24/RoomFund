// src/lib/firestore.ts

import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot,
  DocumentReference,
} from 'firebase/firestore';

import { db } from '../firebase';
import type { Expense, MonthlyBudget, Chore, Roommate } from '../types';
import { generateId } from '../utils/helpers';

// 🔗 Helper to access user collections
export const userCollection = (uid: string, sub: string) => {
  return collection(db, 'users', uid, sub);
};

// 📄 Budget document reference
export const getBudgetDoc = (uid: string): DocumentReference => {
  return doc(db, 'users', uid, 'budget', 'current');
};

// 💰 Expense
export const addExpense = async (uid: string, data: Omit<Expense, 'id'>) => {
  const id = generateId();
  const ref = doc(db, 'users', uid, 'expenses', id);
  await setDoc(ref, { ...data, id });
  await updateRemaining(uid);
};

export const deleteExpense = async (uid: string, id: string) => {
  await deleteDoc(doc(db, 'users', uid, 'expenses', id));
  await updateRemaining(uid);
};

// 📅 Monthly Budget
export const setMonthlyBudget = async (uid: string, budget: MonthlyBudget) => {
  const docRef = getBudgetDoc(uid);
  await setDoc(docRef, budget);
  await updateRemaining(uid);
};

// 🧹 Chores
export const addChore = async (uid: string, chore: Omit<Chore, 'id'> & { id?: string }) => {
  const id = chore.id || generateId();
  const ref = doc(db, 'users', uid, 'chores', id);
  await setDoc(ref, { ...chore, id });
};

export const deleteChore = async (uid: string, id: string) => {
  await deleteDoc(doc(db, 'users', uid, 'chores', id));
};

// 👥 Roommates
export const addRoommate = async (uid: string, roommate: Omit<Roommate, 'id'>) => {
  const id = generateId();
  const ref = doc(db, 'users', uid, 'roommates', id);
  await setDoc(ref, { ...roommate, id });
};

export const deleteRoommate = async (uid: string, id: string) => {
  await deleteDoc(doc(db, 'users', uid, 'roommates', id));
};

// 📊 Update Remaining Budget
export const updateRemaining = async (uid: string) => {
  const expenseSnap = await getDocs(userCollection(uid, 'expenses'));
  const expenses = expenseSnap.docs.map(doc => doc.data() as Expense);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const budgetRef = getBudgetDoc(uid);
  try {
    await updateDoc(budgetRef, { remaining: totalSpent });
  } catch (e) {
    console.warn('No budget set yet. Skipping remaining update.');
  }
};

// 🔁 Clear previous month's data
export const clearMonthlyData = async (uid: string) => {
  const collections = ['expenses', 'chores', 'roommates'];

  for (const name of collections) {
    const qSnap = await getDocs(userCollection(uid, name));
    for (const d of qSnap.docs) {
      await deleteDoc(doc(db, 'users', uid, name, d.id));
    }
  }

  await deleteDoc(getBudgetDoc(uid));
};
