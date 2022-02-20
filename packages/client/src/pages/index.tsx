import { Box, Flex, Stack } from "@chakra-ui/react";
import { VFC } from "react";

import { News } from "../components/index-page/News";
import { TweetForm } from "../components/index-page/TweetForm";
import { Tweets } from "../components/index-page/Tweets";
import { UserMenu } from "../components/index-page/UserMenu";
import { Users } from "../components/index-page/Users";
import { AppLayout } from "../components/shared/AppLayout";

export const Index: VFC = () => {
  const main = (
    <Stack maxW="100%" w="xl" px="4" py="4" spacing="6">
      <TweetForm />
      <Tweets />
    </Stack>
  );

  const left = (
    <Flex
      maxW="100%"
      w="xs"
      h="full"
      px="4"
      pt="4"
      pb="12"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Users />
      <UserMenu />
    </Flex>
  );

  const right = (
    <Box maxW="100%" w="xs" px="4" py="4">
      <News />
    </Box>
  );

  return <AppLayout main={main} left={left} right={right} />;
};
