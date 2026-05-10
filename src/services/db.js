import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Fetches all states and their associated cities.
 * Maps the data to match the structure expected by the UI.
 */
export const getStatesWithCities = async () => {
  try {
    const statesSnapshot = await getDocs(collection(db, 'states'));
    const citiesSnapshot = await getDocs(collection(db, 'cities'));

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
    const docRef = doc(db, 'states', stateId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Fallback: try searching by name if it wasn't an ID
      const q = query(collection(db, 'states'), where('name', '==', stateId.charAt(0).toUpperCase() + stateId.slice(1).toLowerCase()));
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
    const q = query(collection(db, 'cities'), where('stateId', '==', stateId));
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
    const querySnapshot = await getDocs(collection(db, 'featuredCities'));
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
    const querySnapshot = await getDocs(collection(db, 'aduRules'));
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
    const querySnapshot = await getDocs(collection(db, 'professionals'));
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
    const q = query(collection(db, 'alerts'), where('userId', '==', userId));
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
    const q = query(collection(db, 'savedProperties'), where('userId', '==', userId));
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
    const querySnapshot = await getDocs(collection(db, 'professionals'));
    const pros = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return pros.slice(0, 2); // Mocking saved pros behavior
  } catch (error) {
    console.error("Error fetching saved pros:", error);
    return [];
  }
};
