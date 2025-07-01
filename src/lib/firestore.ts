// src/lib/firestore.ts

import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  updateDoc,
  writeBatch,
  CollectionReference,
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
  return doc(db, 'users', uid, 'monthlyBudget', 'active');
};

// 💰 Expense
export const addExpense = async (uid: string, expense: Omit<Expense, 'id'>) => {
  const id = generateId();
  const docRef = doc(db, 'users', uid, 'expenses', id);
  await setDoc(docRef, { ...expense, id });
  await updateRemaining(uid);
};

export const deleteExpense = async (uid: string, id: string) => {
  const docRef = doc(db, 'users', uid, 'expenses', id);
  await deleteDoc(docRef);
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
  const docRef = doc(db, 'users', uid, 'chores', id);
  await setDoc(docRef, { ...chore, id });
};

export const deleteChore = async (uid: string, id: string) => {
  const docRef = doc(db, 'users', uid, 'chores', id);
  await deleteDoc(docRef);
};

// 👥 Roommates
export const addRoommate = async (uid: string, roommate: Omit<Roommate, 'id'>) => {
  const id = generateId();
  const docRef = doc(db, 'users', uid, 'roommates', id);
  await setDoc(docRef, { ...roommate, id });
};

export const deleteRoommate = async (uid: string, id: string) => {
  const docRef = doc(db, 'users', uid, 'roommates', id);
  await deleteDoc(docRef);
};

// 📊 Budget Auto-Updater
export const updateRemaining = async (uid: string) => {
  const expenseSnap = await getDocs(userCollection(uid, 'expenses'));
  const expenses = expenseSnap.docs.map((doc) => doc.data() as Expense);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const budgetRef = getBudgetDoc(uid);
  try {
    await updateDoc(budgetRef, { remaining: totalSpent });
  } catch (err) {
    console.warn('Budget doc missing. Skipping updateRemaining.');
  }
};
