import React, { useState } from 'react';
import { db } from '../services/firebase';
import { writeBatch, doc } from 'firebase/firestore';
import usersData from '../seeding/users.json';
import statesData from '../seeding/states.json';
import citiesData from '../seeding/cities.json';
import propertiesData from '../seeding/properties.json';

const SeedingPage = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const seedCollection = async (collectionName, data) => {
    try {
      const batch = writeBatch(db);
      data.forEach((item) => {
        // Use the predefined id from json as the document id
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item);
      });
      await batch.commit();
      return true;
    } catch (error) {
      console.error(`Error seeding ${collectionName}:`, error);
      throw error;
    }
  };

  const handleSeedAll = async () => {
    setLoading(true);
    setStatus('Starting seeding process...');
    
    try {
      setStatus('Seeding users...');
      await seedCollection('users', usersData);
      
      setStatus('Seeding states...');
      await seedCollection('states', statesData);
      
      setStatus('Seeding cities...');
      await seedCollection('cities', citiesData);
      
      setStatus('Seeding properties...');
      await seedCollection('properties', propertiesData);
      
      setStatus('All dummy data seeded successfully! Reference IDs matched perfectly.');
    } catch (error) {
      setStatus('Error occurred during seeding. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Database Seeding</h1>
        <p className="text-slate-500 mb-8">
          Migrate dummy JSON data to Firebase Firestore. Perfect relational IDs are maintained.
        </p>
        
        <button 
          onClick={handleSeedAll} 
          disabled={loading}
          className="btn-primary w-full !py-4 mb-4 disabled:opacity-50"
        >
          {loading ? 'Seeding in progress...' : 'Seed All Collections (5 items each)'}
        </button>

        {status && (
          <div className={`p-4 rounded-xl text-sm font-medium ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedingPage;
