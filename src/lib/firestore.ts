// src/lib/firestore.ts

import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getFirestore,
  updateDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';

import { db } from '../firebase';
import type { Expense, MonthlyBudget, Chore, Roommate } from '../types';

// 📁 Helper to get subcollections for a user
export const userCollection = (uid: string, sub: string) => {
  return collection(db, 'users', uid, sub);
};

// 📁 Budget document
export const getBudgetDoc = (uid: string) => {
  return doc(db, 'users', uid, 'monthlyBudget', 'active');
};

// 💰 Expense
export const addExpense = async (uid: string, expense: Expense) => {
  const docRef = doc(userCollection(uid, 'expenses'));
  await setDoc(docRef, expense);
  await updateRemaining(uid);
};

export const deleteExpense = async (uid: string, id: string) => {
  const docRef = doc(db, 'users', uid, 'expenses', id);
  await deleteDoc(docRef);
  await updateRemaining(uid);
};

// 📅 Budget
export const setMonthlyBudget = async (uid: string, budget: MonthlyBudget) => {
  const docRef = getBudgetDoc(uid);
  await setDoc(docRef, budget);
  await updateRemaining(uid);
};

// 🧹 Chore
export const addChore = async (uid: string, chore: Chore) => {
  const docRef = doc(userCollection(uid, 'chores'));
  await setDoc(docRef, chore);
};

export const deleteChore = async (uid: string, id: string) => {
  const docRef = doc(db, 'users', uid, 'chores', id);
  await deleteDoc(docRef);
};

// 👥 Roommates
export const addRoommate = async (uid: string, roommate: Roommate) => {
  const docRef = doc(userCollection(uid, 'roommates'));
  await setDoc(docRef, roommate);
};

export const deleteRoommate = async (uid: string, id: string) => {
  const docRef = doc(db, 'users', uid, 'roommates', id);
  await deleteDoc(docRef);
};

// 🔁 Auto-update remaining budget
export const updateRemaining = async (uid: string) => {
  const expenseSnap = await getDocs(userCollection(uid, 'expenses'));
  const expenses = expenseSnap.docs.map((doc) => doc.data() as Expense);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const budgetRef = getBudgetDoc(uid);
  await updateDoc(budgetRef, { remaining: totalSpent });
};
