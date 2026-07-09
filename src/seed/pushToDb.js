import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { ALL_50_STATES } from '../data/statesData.js';
import { firebaseConfig } from '../config/firebaseConfig.js';
import { COLLECTIONS } from '../config/collections.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const run = async () => {
  try {
    console.log(`Starting to push ${ALL_50_STATES.length} states to Firestore collection: ${COLLECTIONS.STATES}`);
    
    for (const state of ALL_50_STATES) {
      // Use state.id as the document ID
      const docRef = doc(db, COLLECTIONS.STATES, state.id);
      await setDoc(docRef, state);
      console.log(`Pushed state: ${state.name} (${state.id})`);
    }

    console.log("Migration to database completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error pushing to database:", error);
    process.exit(1);
  }
}

run();
