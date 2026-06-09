import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// On the server during build/prerender, env vars may be absent.
// Guard initialization so the module import never throws.
// useEffect (client-only) ensures real Firebase calls only happen in the browser.
const isServer = typeof window === "undefined";
const hasConfig = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!isServer || hasConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Server-side stubs — never actually called because Firebase
  // hooks live inside useEffect / user-interaction handlers.
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
}

export { auth, db };
export default app;
