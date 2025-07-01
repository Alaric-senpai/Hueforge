// import admin from 'firebase-admin';
// import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
//   ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
//   : undefined;

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const db = getFirestore();
// const serverTimestamp = Timestamp.now;

// export { db, serverTimestamp, collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase-admin/firestore';
