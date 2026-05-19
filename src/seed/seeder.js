// Firestore Seeding Engine
// Contains functions to delete, replace, add, and update Firestore collections using batch writes.
// Also synchronizes seeded data with localStorage to ensure seamless local operation.

import { db } from '../services/firebase';
import { 
  collection, 
  getDocs, 
  writeBatch, 
  doc, 
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { COLLECTIONS } from '../config/collections';
import {
  SEED_USERS,
  SEED_STATES,
  SEED_CITIES,
  SEED_ADU_LAWS,
  SEED_PROPERTY_CHECKS,
  SEED_PROFESSIONALS,
  SEED_COSTS,
  SEED_LAW_UPDATES,
  SEED_NOTIFICATIONS,
  SEED_SUBSCRIPTIONS,
  SEED_ALERTS,
  SEED_LOGS,
  SEED_INQUIRIES,
  SEED_SETTINGS
} from './seedData';

// Map collections to seed data arrays
export const SEED_DATA_MAP = {
  [COLLECTIONS.USERS]: SEED_USERS,
  [COLLECTIONS.STATES]: SEED_STATES,
  [COLLECTIONS.CITIES]: SEED_CITIES,
  [COLLECTIONS.ADU_LAWS]: SEED_ADU_LAWS,
  [COLLECTIONS.PROPERTY_CHECKS]: SEED_PROPERTY_CHECKS,
  [COLLECTIONS.PROFESSIONALS]: SEED_PROFESSIONALS,
  [COLLECTIONS.COSTS]: SEED_COSTS,
  [COLLECTIONS.LAW_UPDATES]: SEED_LAW_UPDATES,
  [COLLECTIONS.NOTIFICATIONS]: SEED_NOTIFICATIONS,
  [COLLECTIONS.SUBSCRIPTIONS]: SEED_SUBSCRIPTIONS,
  [COLLECTIONS.ALERTS]: SEED_ALERTS,
  [COLLECTIONS.LOGS]: SEED_LOGS,
  [COLLECTIONS.CONTACT_US]: SEED_INQUIRIES,
  [COLLECTIONS.SETTINGS]: SEED_SETTINGS
};

// Map collections to LocalStorage sync keys
const LOCAL_STORAGE_SYNC_MAP = {
  [COLLECTIONS.USERS]: 'adu-db-users',
  [COLLECTIONS.STATES]: 'adu-db-states',
  [COLLECTIONS.PROFESSIONALS]: 'adu-db-directory',
  [COLLECTIONS.COSTS]: 'adu-db-costs',
  [COLLECTIONS.ALERTS]: 'adu-db-alerts',
  [COLLECTIONS.LOGS]: 'adu-db-logs',
  [COLLECTIONS.CONTACT_US]: 'adu-db-contactus',
  [COLLECTIONS.SETTINGS]: 'adu-db-settings'
};

// Helper to chunk array
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Deletes all documents in a Firestore collection
 * @param {string} collectionName 
 */
export const deleteCollection = async (collectionName) => {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  
  if (snapshot.empty) return;

  const chunks = chunkArray(snapshot.docs, 400); // 400 to stay safely below 500 batch limit
  
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  }

  // Clear LocalStorage equivalent if it exists
  const lsKey = LOCAL_STORAGE_SYNC_MAP[collectionName];
  if (lsKey) {
    localStorage.setItem(lsKey, JSON.stringify([]));
  }
};

/**
 * Adds new seed data to a collection using batch writes
 * @param {string} collectionName 
 * @param {Array} dataArray 
 */
export const addCollectionData = async (collectionName, dataArray) => {
  if (!dataArray || dataArray.length === 0) return;

  const chunks = chunkArray(dataArray, 400);

  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((item) => {
      // If item has a specific string ID, use it, else let Firestore auto-generate
      const docId = item.id ? String(item.id) : undefined;
      const docRef = docId ? doc(db, collectionName, docId) : doc(collection(db, collectionName));
      
      const { id, ...dataToSave } = item;
      // Keep ID in document for easier querying
      batch.set(docRef, { id: docId || docRef.id, ...dataToSave });
    });
    await batch.commit();
  }

  // Sync to LocalStorage if supported
  const lsKey = LOCAL_STORAGE_SYNC_MAP[collectionName];
  if (lsKey) {
    const existingStr = localStorage.getItem(lsKey);
    let existing = [];
    try {
      existing = existingStr ? JSON.parse(existingStr) : [];
    } catch {
      existing = [];
    }
    const updated = [...existing, ...dataArray];
    localStorage.setItem(lsKey, JSON.stringify(updated));
  }
};

/**
 * Updates matching documents or inserts them if not exists (upsert)
 * @param {string} collectionName 
 * @param {Array} dataArray 
 */
export const updateCollectionData = async (collectionName, dataArray) => {
  if (!dataArray || dataArray.length === 0) return;

  const chunks = chunkArray(dataArray, 400);

  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((item) => {
      if (!item.id) {
        // No ID specified, create a new document
        const docRef = doc(collection(db, collectionName));
        batch.set(docRef, { id: docRef.id, ...item });
      } else {
        const docRef = doc(db, collectionName, String(item.id));
        // Use merge option to update matching fields or create if not exists
        batch.set(docRef, item, { merge: true });
      }
    });
    await batch.commit();
  }

  // Sync LocalStorage
  const lsKey = LOCAL_STORAGE_SYNC_MAP[collectionName];
  if (lsKey) {
    const existingStr = localStorage.getItem(lsKey);
    let existing = [];
    try {
      existing = existingStr ? JSON.parse(existingStr) : [];
    } catch {
      existing = [];
    }

    dataArray.forEach((item) => {
      const idx = existing.findIndex(e => String(e.id) === String(item.id));
      if (idx !== -1) {
        existing[idx] = { ...existing[idx], ...item };
      } else {
        existing.push(item);
      }
    });
    localStorage.setItem(lsKey, JSON.stringify(existing));
  }
};

/**
 * Run seeding action for a specific collection
 * @param {string} collectionName 
 * @param {string} action - 'seed' | 'replace' | 'update' | 'delete'
 */
export const seedCollection = async (collectionName, action) => {
  const data = SEED_DATA_MAP[collectionName];

  switch (action) {
    case 'seed':
      await addCollectionData(collectionName, data);
      break;
    case 'replace':
      await deleteCollection(collectionName);
      await addCollectionData(collectionName, data);
      break;
    case 'update':
      await updateCollectionData(collectionName, data);
      break;
    case 'delete':
      await deleteCollection(collectionName);
      break;
    default:
      throw new Error(`Unsupported seeding action: ${action}`);
  }
};
