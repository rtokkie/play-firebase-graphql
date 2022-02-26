import { Firestore, Timestamp } from "firebase-admin/firestore";
import { first } from "lodash";

import { getDocs } from "../query/util/get";
import { tweetsRef, userTweetsRef } from "../typed-ref";

// NOTE: Query
export const getTweet = async (db: Firestore, { tweetId }: { tweetId: string }) => {
  const tweetDocs = await getDocs(tweetsRef(db).where("tweetId", "==", tweetId));
  const tweetDoc = first(tweetDocs);
  if (!tweetDoc) throw new Error("tweetDoc not found at getTweet");
  return tweetDoc;
};

// NOTE: Mutation
export const createTweet = async (
  db: Firestore,
  { tweetId, creatorId, content }: { tweetId: string; creatorId: string; content: string }
) => {
  await userTweetsRef(db, { userId: creatorId }).doc(tweetId).set({
    content,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    tweetId,
    creatorId,
  });
};