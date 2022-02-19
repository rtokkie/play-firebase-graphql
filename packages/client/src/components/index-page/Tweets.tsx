import { gql } from "@apollo/client";
import { Box, Stack } from "@chakra-ui/react";
import { VFC } from "react";

import { useTweetsForIndexPageQuery } from "../../graphql/generated";

gql`
  query tweetsForIndexPage {
    tweets {
      id
      content
      creator {
        id
        displayName
      }
    }
  }
`;

const useTweets = () => {
  const { data } = useTweetsForIndexPageQuery();
  const tweets = data?.tweets ?? [];

  return { tweets };
};

export const Tweets: VFC = () => {
  const { tweets } = useTweets();

  return (
    <Stack>
      <Box alignSelf="center" fontWeight="bold">
        Tweets
      </Box>
      <Box borderWidth="1px" rounded="md">
        {tweets.map((tweet) => (
          <Box
            key={tweet.id}
            px="3"
            py="2"
            borderBottomWidth="1px"
            _last={{ borderBottomWidth: "0" }}
          >
            <Box fontWeight="bold">{tweet.creator.displayName}</Box>
            <Box>{tweet.content}</Box>
          </Box>
        ))}
      </Box>
    </Stack>
  );
};