import { gql } from "@apollo/client";
import { Box, Button, Stack, Textarea } from "@chakra-ui/react";
import { FormEventHandler, VFC } from "react";

import { useCreateTweetMutation } from "../../graphql/generated";
import { useTextInput } from "../../hooks/useTextInput";

gql`
  mutation createTweet($input: CreateTweetInput!) {
    createTweet(input: $input) {
      id
      content
      createdAt
      creator {
        id
        displayName
      }
    }
  }
`;

const useTweetForm = () => {
  const [createTweet] = useCreateTweetMutation();
  const [tweetContentInput, resetTweetContentInput] = useTextInput();

  const onCreateTweet: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await createTweet({ variables: { input: { content: tweetContentInput.value } } });
    resetTweetContentInput();
  };

  return {
    tweetContentInput,
    onCreateTweet,
  };
};

export const TweetForm: VFC = () => {
  const { tweetContentInput, onCreateTweet } = useTweetForm();

  return (
    <Stack>
      <Box alignSelf="center" fontWeight="bold">
        Tweet Form
      </Box>
      <form onSubmit={onCreateTweet}>
        <Stack>
          <Textarea {...tweetContentInput} required rows={5} />
          <Button type="submit">Post</Button>
        </Stack>
      </form>
    </Stack>
  );
};
