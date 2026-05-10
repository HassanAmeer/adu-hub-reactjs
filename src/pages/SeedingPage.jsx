import React, { useState } from 'react';
import { db } from '../services/firebase';
import { writeBatch, doc, getDocs, collection } from 'firebase/firestore';
import { COLLECTIONS } from '../services/collections-names';

import usersData from '../seeding/users.json';
import statesData from '../seeding/states.json';
import citiesData from '../seeding/cities.json';
import propertiesData from '../seeding/properties.json';
import featuredCitiesData from '../seeding/featuredCities.json';
import aduRulesData from '../seeding/aduRules.json';
import professionalsData from '../seeding/professionals.json';
import alertsData from '../seeding/alerts.json';
import savedPropertiesData from '../seeding/savedProperties.json';

const SeedingPage = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(null);

  const totalCollectionsCount = Object.keys(COLLECTIONS).length;

  const seedCollection = async (collectionName, data, merge = false) => {
    try {
      const batch = writeBatch(db);
      data.forEach((item) => {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item, { merge });
      });
      await batch.commit();
      return true;
    } catch (error) {
      console.error(`Error seeding ${collectionName}:`, error);
      throw error;
    }
  };

  const handleMigration = async (type) => {
    setLoading(type);
    setStatus(`Starting ${type === 'merge' ? 'update' : 'new'} migration...`);
    const merge = type === 'merge';

    try {
      setStatus(`Migrating ${COLLECTIONS.USERS}...`);
      await seedCollection(COLLECTIONS.USERS, usersData, merge);

      setStatus(`Migrating ${COLLECTIONS.STATES}...`);
      await seedCollection(COLLECTIONS.STATES, statesData, merge);

      setStatus(`Migrating ${COLLECTIONS.CITIES}...`);
      await seedCollection(COLLECTIONS.CITIES, citiesData, merge);

      setStatus(`Migrating ${COLLECTIONS.PROPERTIES}...`);
      await seedCollection(COLLECTIONS.PROPERTIES, propertiesData, merge);

      setStatus(`Migrating ${COLLECTIONS.FEATURED_CITIES}...`);
      await seedCollection(COLLECTIONS.FEATURED_CITIES, featuredCitiesData, merge);

      setStatus(`Migrating ${COLLECTIONS.ADU_RULES}...`);
      await seedCollection(COLLECTIONS.ADU_RULES, aduRulesData, merge);

      setStatus(`Migrating ${COLLECTIONS.PROFESSIONALS}...`);
      await seedCollection(COLLECTIONS.PROFESSIONALS, professionalsData, merge);

      setStatus(`Migrating ${COLLECTIONS.ALERTS}...`);
      await seedCollection(COLLECTIONS.ALERTS, alertsData, merge);

      setStatus(`Migrating ${COLLECTIONS.SAVED_PROPERTIES}...`);
      await seedCollection(COLLECTIONS.SAVED_PROPERTIES, savedPropertiesData, merge);

      setStatus(`Migration complete! All dummy data seeded successfully.`);
    } catch (error) {
      setStatus('Error occurred during migration. Check console for details.');
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL data from these collections?")) return;

    setLoading('delete');
    setStatus('Deleting all data from collections...');

    try {
      const collectionsArr = Object.values(COLLECTIONS);

      for (const colName of collectionsArr) {
        setStatus(`Fetching and deleting ${colName}...`);
        const querySnapshot = await getDocs(collection(db, colName));

        if (!querySnapshot.empty) {
          const batch = writeBatch(db);
          querySnapshot.forEach((document) => {
            batch.delete(doc(db, colName, document.id));
          });
          await batch.commit();
        }
      }

      setStatus('All collections have been successfully emptied!');
    } catch (error) {
      console.error(error);
      setStatus('Error occurred during deletion. Check console.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Database Management</h1>
        <p className="text-slate-500 mb-6">
          Manage your dummy JSON data migrations to Firebase Firestore.
        </p>

        <div className="mb-6 py-3 px-4 bg-secondary/10 text-secondary-dark rounded-xl text-sm leading-relaxed">
          <span className="font-bold">Managed Collections ({totalCollectionsCount}):</span> {Object.values(COLLECTIONS).join(', ')}.
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleMigration('new')}
            disabled={!!loading}
            className="btn-primary w-full !py-3 disabled:opacity-50"
          >
            {loading === 'new' ? 'Processing...' : 'New Migration (Overwrite)'}
          </button>

          <button
            onClick={() => handleMigration('merge')}
            disabled={!!loading}
            className="btn-outline w-full !py-3 disabled:opacity-50 border border-slate-200"
          >
            {loading === 'merge' ? 'Processing...' : 'Update Migration (Merge)'}
          </button>

          <button
            onClick={handleDeleteAll}
            disabled={!!loading}
            className="bg-danger/10 hover:bg-danger/20 text-danger w-full py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            {loading === 'delete' ? 'Processing...' : 'Delete Every Data (Reset)'}
          </button>
        </div>

        {status && (
          <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedingPage;
