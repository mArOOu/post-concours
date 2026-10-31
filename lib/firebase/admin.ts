import { cert, getApps, getApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getFirebaseEnv } from "./env";

let firebaseAdminInitialized = false;

export function getFirebaseAdminApp() {
  if (!firebaseAdminInitialized) {
    const firebaseEnv = getFirebaseEnv();
    const privateKey = firebaseEnv.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: firebaseEnv.FIREBASE_PROJECT_ID,
          clientEmail: firebaseEnv.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        storageBucket: firebaseEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }

    firebaseAdminInitialized = true;
  }

  return getApp();
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getFirebaseAdminStorage() {
  return getStorage(getFirebaseAdminApp());
}
