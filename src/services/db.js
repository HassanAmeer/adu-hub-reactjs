import { collection, getDocs, doc, getDoc, query, where, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './collections-names';

/**
 * Fetches all states and their associated cities.
 * Maps the data to match the structure expected by the UI.
 */
export const getStatesWithCities = async () => {
  try {
    const statesSnapshot = await getDocs(collection(db, COLLECTIONS.STATES));
    const citiesSnapshot = await getDocs(collection(db, COLLECTIONS.CITIES));

    const citiesData = citiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const statesData = statesSnapshot.docs.map(doc => {
      const state = { id: doc.id, ...doc.data() };
      // Find cities belonging to this state
      const stateCities = citiesData
        .filter(city => city.stateId === state.id)
        .map(city => city.name);
      
      return {
        ...state,
        status: state.status || 'Allowed', // Fallback if missing
        cities: stateCities
      };
    });

    return statesData;
  } catch (error) {
    console.error("Error fetching states with cities:", error);
    return [];
  }
};

/**
 * Fetches a single state by its ID.
 */
export const getStateById = async (stateId) => {
  try {
    // If stateId is actually a name (like 'california' from old mock data routing), 
    // we need to query by name. But with new routing it should be the document ID (e.g. 'st_1')
    const docRef = doc(db, COLLECTIONS.STATES, stateId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Fallback: try searching by name if it wasn't an ID
      const q = query(collection(db, COLLECTIONS.STATES), where('name', '==', stateId.charAt(0).toUpperCase() + stateId.slice(1).toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    }
  } catch (error) {
    console.error(`Error fetching state with ID ${stateId}:`, error);
    return null;
  }
};

/**
 * Fetches cities for a given state ID.
 */
export const getCitiesByState = async (stateId) => {
  try {
    const q = query(collection(db, COLLECTIONS.CITIES), where('stateId', '==', stateId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().name);
  } catch (error) {
    console.error(`Error fetching cities for state ${stateId}:`, error);
    return [];
  }
};

/**
 * Fetches featured cities for the home page.
 */
export const getFeaturedCities = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.FEATURED_CITIES));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching featured cities:", error);
    return [];
  }
};

/**
 * Fetches ADU rules for the state page.
 */
export const getAduRules = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.ADU_RULES));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching ADU rules:", error);
    return [];
  }
};

/**
 * Fetches all professionals for the directory page.
 */
export const getProfessionals = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PROFESSIONALS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return [];
  }
};

/**
 * Fetches alerts for a specific user.
 */
export const getAlerts = async (userId) => {
  try {
    // For dummy purposes, we fetch all alerts if userId matches or if no rule is strictly applied
    const q = query(collection(db, COLLECTIONS.ALERTS), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }
};

/**
 * Fetches saved properties for a specific user.
 */
export const getSavedProperties = async (userId) => {
  try {
    const q = query(collection(db, COLLECTIONS.SAVED_PROPERTIES), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching saved properties:", error);
    return [];
  }
};

/**
 * Fetches saved professionals for a specific user.
 * For dummy implementation, simply fetches all professionals and limits to 2.
 */
export const getSavedPros = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PROFESSIONALS));
    const pros = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return pros.slice(0, 2); // Mocking saved pros behavior
  } catch (error) {
    console.error("Error fetching saved pros:", error);
    return [];
  }
};

/**
 * Logs in a user by checking email and password against the users collection.
 */
export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  try {
    const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('User not found.');
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    // Simplistic plain-text check due to backend-firestore-only constraints
    if (userData.password !== password) {
      throw new Error('Incorrect password.');
    }
    
    return { id: userDoc.id, ...userData };
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

/**
 * Signs up a user by checking if email exists and then adding to users collection.
 */
export const signupUser = async (email, password, name) => {
  if (!email || !password || !name.trim()) {
    throw new Error('All fields are required.');
  }
  try {
    const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Email already in use.');
    }
    
    // Create new document reference in USERS collection
    const newUserRef = doc(collection(db, COLLECTIONS.USERS));
    const newUser = {
      id: newUserRef.id,
      email,
      password, // Simple plain text for dummy setup
      name,
      displayName: name,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    await setDoc(newUserRef, newUser);
    return newUser;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};
