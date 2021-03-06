import { Resolvers } from "../../graphql/generated";
import { isSignedIn } from "../../lib/authorization";
import { createTweet } from "../../lib/command/createTweet";
import { deleteTweet } from "../../lib/command/deleteTweet";
import { follow } from "../../lib/command/follow";
import { like } from "../../lib/command/like";
import { unFollow } from "../../lib/command/unFollow";
import { unLike } from "../../lib/command/unLike";
import { updateTweet } from "../../lib/command/updateTweet";
import { updateUser } from "../../lib/command/updateUser";
import { getTweet } from "../../lib/query/getTweet";
import { getDoc } from "../../lib/query-util/get";
import { usersRef } from "../../lib/typed-ref";

export const Mutation: Resolvers["Mutation"] = {
  updateProfile: async (parent, args, context) => {
    isSignedIn(context);

    await updateUser(context.db, {
      userId: context.uid,
      displayName: args.input.displayName,
    });
    const meDoc = await getDoc(usersRef(context.db).doc(context.uid));
    return meDoc;
  },

  createTweet: async (parent, args, context) => {
    isSignedIn(context);

    const { id } = await createTweet(context.db, {
      userId: context.uid,
      content: args.input.content,
    });
    const tweetDoc = await getTweet(context.db, { id });
    return tweetDoc;
  },

  updateTweet: async (parent, args, context) => {
    isSignedIn(context);

    await updateTweet(context.db, {
      tweetId: args.id,
      userId: context.uid,
      content: args.input.content,
    });
    const tweetDoc = await getTweet(context.db, { id: args.id });
    return tweetDoc;
  },

  deleteTweet: async (parent, args, context) => {
    isSignedIn(context);

    await deleteTweet(context.db, { id: args.id, userId: context.uid });
    const meDoc = await getDoc(usersRef(context.db).doc(context.uid));
    return meDoc;
  },

  follow: async (parent, args, context) => {
    isSignedIn(context);

    await follow(context.db, {
      followerId: context.uid,
      followedId: args.userId,
    });
    const meDoc = await getDoc(usersRef(context.db).doc(context.uid));
    return meDoc;
  },

  unFollow: async (parent, args, context) => {
    isSignedIn(context);

    await unFollow(context.db, {
      followerId: context.uid,
      followedId: args.userId,
    });
    const meDoc = await getDoc(usersRef(context.db).doc(context.uid));
    return meDoc;
  },

  like: async (parent, args, context) => {
    isSignedIn(context);

    await like(context.db, { userId: context.uid, tweetId: args.tweetId });
    const tweetDoc = await getTweet(context.db, { id: args.tweetId });
    return tweetDoc;
  },

  unLike: async (parent, args, context) => {
    isSignedIn(context);

    await unLike(context.db, { userId: context.uid, tweetId: args.tweetId });
    const tweetDoc = await getTweet(context.db, { id: args.tweetId });
    return tweetDoc;
  },
};
