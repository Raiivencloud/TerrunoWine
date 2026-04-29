import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, orderBy, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw-x-8Z6-5-3-2-1-0-9-8-7-6-5-4-3-2-1", 
  authDomain: "vinotecawine-34d31.firebaseapp.com",
  projectId: "vinotecawine-34d31",
  storageBucket: "vinotecawine-34d31.firebasestorage.app",
  messagingSenderId: "305260840505",
  appId: "1:305260840505:web:86556f8f7c6699a80e1590",
  measurementId: "G-936EPD5F84"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getProducts = async () => {
  const q = query(collection(db, "productos"), orderBy("nombre"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const saveOrder = async (orderData: any) => {
  try {
    const docRef = await addDoc(collection(db, "pedidos"), {
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const toggleFavorite = async (userId: string, productId: string, isFavorite: boolean) => {
  const favRef = doc(db, `users/${userId}/favoritos`, productId);
  if (isFavorite) {
    await deleteDoc(favRef);
  } else {
    await setDoc(favRef, { savedAt: new Date().toISOString() });
  }
};

export const getFavorites = async (userId: string) => {
  const q = collection(db, `users/${userId}/favoritos`);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.id);
};
