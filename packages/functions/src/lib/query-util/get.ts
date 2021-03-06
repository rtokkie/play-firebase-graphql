import { CollectionReference, DocumentReference, Query } from "firebase-admin/firestore";

export const getDoc = async <T>(docRef: DocumentReference<T>) => {
  const doc = await docRef.get();
  if (!doc.exists) throw new Error("doc not found at getDoc");
  return { id: doc.id, ref: doc.ref, ...(doc.data() as T) };
};

export const getDocs = <T>(collectionRef: CollectionReference<T> | Query<T>) =>
  collectionRef
    .get()
    .then(({ docs }) => docs.map((doc) => ({ id: doc.id, ref: doc.ref, ...doc.data() })));

export const getSnap = async <T>(docRef: DocumentReference<T>) => docRef.get();

export const getSnaps = <T>(collectionRef: CollectionReference<T> | Query<T>) =>
  collectionRef.get().then(({ docs }) => docs);
