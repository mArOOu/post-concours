import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase/admin";

export type AdminPrincipal = {
  uid: string;
  email: string | null;
};

export async function isFirebaseAdminUid(uid: string) {
  const adminRecord = await getFirebaseAdminDb()
    .collection("admins")
    .doc(uid)
    .get();

  return adminRecord.exists && adminRecord.data()?.active !== false;
}

export async function verifyAdminIdToken(idToken: string) {
  const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);

  if (!(await isFirebaseAdminUid(decodedToken.uid))) {
    return null;
  }

  return {
    uid: decodedToken.uid,
    email: decodedToken.email ?? null,
  } satisfies AdminPrincipal;
}
