import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// ─── Firebase Project Config ─────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBUCydImfP1deVsxhZ2GwAvEkGbX-SZplM",
  authDomain: "shop-aaf2f.firebaseapp.com",
  projectId: "shop-aaf2f",
  storageBucket: "shop-aaf2f.firebasestorage.app",
  messagingSenderId: "671672776017",
  appId: "1:671672776017:web:9d8a4992df91de9917cf70",
  measurementId: "G-PDHK1M76BW",
};

// ─── Initialize Firebase (singleton) ────────────────────────────────────────
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// ─── Analytics (browser-only — SSR safe) ────────────────────────────────────
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export { auth, db, analytics };
export default app;
