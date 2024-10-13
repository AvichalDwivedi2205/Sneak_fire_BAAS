// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { collection, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Sneaker } from "@/schema/schema";
import { getDatabase } from "firebase/database";


export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL:process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase    
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const storage = getStorage(app);
const realtimeDb = getDatabase(app);

const getSneakers = async (): Promise<Sneaker[]> => {
  const sneakersCol = collection(firestore, 'sneakers');
  const snapshot = await getDocs(sneakersCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Sneaker[];
};

export async function getSneakerById(id: string): Promise<Sneaker | null> {
  const sneakerRef = doc(firestore, 'sneakers', id);
  const sneakerSnap = await getDoc(sneakerRef);

  if (sneakerSnap.exists()) {
    return { id: sneakerSnap.id, ...sneakerSnap.data() } as Sneaker;
  } else {
    return null;
  }
}

export { app, auth, googleProvider, firestore, storage, getSneakers, realtimeDb };
