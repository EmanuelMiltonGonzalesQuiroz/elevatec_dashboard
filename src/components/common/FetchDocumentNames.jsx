import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../connection/firebase';

const FetchDocumentNames = ({ collectionName, onDataFetched }) => {
  useEffect(() => {
    const fetchDocNames = async () => {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      const names = snapshot.docs.map(doc => doc.id);
      onDataFetched(names);
    };

    fetchDocNames();
  }, [collectionName, onDataFetched]);

  return null;
};

export default FetchDocumentNames;
