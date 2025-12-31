// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC03RauSYpjVpUlDHN_7mgWdLOTut-eOeA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hint-hub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hint-hub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hint-hub.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "754731993500",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:754731993500:web:bb5e2abe651f6e8b97e059",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-W1BWBR5WLZ"
};

let auth: Auth;

try {
  console.log('[Firebase] Initializing Firebase with config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' + firebaseConfig.apiKey.slice(-4) : 'missing'
  });

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  console.log('[Firebase] Firebase initialized successfully');
  console.log('[Firebase] Auth instance created:', !!auth);
} catch (error) {
  console.error('[Firebase] Error initializing Firebase:', error);
  console.error('[Firebase] Error details:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });

  // Re-throw the error so it's caught by ErrorBoundary
  throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

export { auth }; 