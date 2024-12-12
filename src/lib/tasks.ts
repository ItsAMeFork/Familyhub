import { ref, push, get } from 'firebase/database';
import { db } from './firebase';

export async function initializeDefaultTasks() {
  const tasksRef = ref(db, 'tasks');
  const snapshot = await get(tasksRef);
  
  // Only initialize if no tasks exist
  if (snapshot.exists()) {
    return;
  }
  
  const defaultTasks = [
    { title: 'Clean Kitchen', status: 'todo' },
    { title: 'Take out Trash', status: 'todo' },
    { title: 'Do Laundry', status: 'todo' },
    { title: 'Vacuum Living Room', status: 'todo' },
    { title: 'Water Plants', status: 'todo' },
    { title: 'Feed Pets', status: 'todo' },
    { title: 'Make Beds', status: 'todo' },
    { title: 'Dust Furniture', status: 'todo' },
    { title: 'Clean Bathroom', status: 'todo' },
    { title: 'Mow Lawn', status: 'todo' }
  ];

  try {
    const batch = {};
    const now = new Date().toISOString();
    defaultTasks.forEach((task, index) => {
      batch[`task${index + 1}`] = {
        ...task,
        assignedTo: null,
        createdAt: now,
        lastCompletedAt: null
      };
    });

    await push(tasksRef, batch);
    console.log('Default tasks initialized successfully');
  } catch (error) {
    console.error('Error initializing default tasks:', error);
  }
}