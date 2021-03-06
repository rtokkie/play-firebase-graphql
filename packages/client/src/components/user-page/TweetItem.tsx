import { gql } from "@apollo/client";
import { DeleteIcon, EditIcon, StarIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, HStack, Stack, Textarea, VStack } from "@chakra-ui/react";
import { format } from "date-fns";
import { useState, VFC } from "react";

import { useCurrentUser } from "../../context/CurrentUser";
import {
  TweetItemFragment,
  useDeleteTweetMutation,
  useLikeMutation,
  useUnLikeMutation,
  useUpdateTweetMutation,
} from "../../graphql/generated";
import { useTextInput } from "../../hooks/useTextInput";

gql`
  mutation DeleteTweet($id: ID!) {
    deleteTweet(id: $id) {
      id
    }
  }

  mutation UpdateTweet($id: ID!, $input: UpdateTweetInput!) {
    updateTweet(id: $id, input: $input) {
      id
      ...TweetItem
    }
  }

  mutation Like($tweetId: ID!) {
    like(tweetId: $tweetId) {
      id
      ...TweetItem
    }
  }

  mutation UnLike($tweetId: ID!) {
    unLike(tweetId: $tweetId) {
      id
      ...TweetItem
    }
  }
`;

gql`
  fragment TweetItem on Tweet {
    id
    content
    createdAt
    postedBy {
      id
      displayName
    }
    liked
  }
`;

type TweetItemProps = { tweet: TweetItemFragment };

export const TweetItem: VFC<TweetItemProps> = ({ tweet }) => {
  const currentUser = useCurrentUser();

  const [deleteTweet] = useDeleteTweetMutation();
  const [updateTweet] = useUpdateTweetMutation();

  const [like] = useLikeMutation();
  const [unLike] = useUnLikeMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [contentInput] = useTextInput(tweet.content);

  const onUpdate = async () => {
    await updateTweet({ variables: { id: tweet.id, input: { content: contentInput.value } } });
    setIsEditing(false);
  };

  return (
    <Stack>
      <HStack justifyContent="space-between">
        <HStack>
          <Box fontWeight="bold" noOfLines={1}>
            {tweet.postedBy.displayName}
          </Box>
          <Box flexShrink={0}>{format(new Date(tweet.createdAt), "yyyy-MM-dd HH:mm")}</Box>
        </HStack>
        {tweet.postedBy.id === currentUser.id && (
          <HStack>
            <Button
              size="xs"
              onClick={() => {
                setIsEditing((prev) => !prev);
              }}
            >
              <EditIcon />
            </Button>

            <Button
              size="xs"
              onClick={() => {
                deleteTweet({ variables: { id: tweet.id } });
              }}
            >
              <DeleteIcon />
            </Button>
          </HStack>
        )}
      </HStack>

      {isEditing ? (
        <VStack my="2">
          <Textarea {...contentInput} rows={5} />
          <Button
            alignSelf="end"
            size="xs"
            onClick={() => {
              onUpdate();
            }}
          >
            update
          </Button>
        </VStack>
      ) : (
        <Box>{tweet.content}</Box>
      )}

      <HStack>
        {tweet.liked ? (
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              unLike({ variables: { tweetId: tweet.id } });
            }}
          >
            <StarIcon color="yellow.400" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              like({ variables: { tweetId: tweet.id } });
            }}
          >
            <StarIcon color="gray.400" />
          </Button>
        )}
      </HStack>
    </Stack>
  );
};
