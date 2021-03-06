import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ReactNode, useEffect, useMemo, VFC } from "react";

import { GRAPHQL_ENDPOINT } from "../constants";
import { useAuth } from "./Auth";

const httpLink = createHttpLink({ uri: GRAPHQL_ENDPOINT });

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        tweets: {
          keyArgs: false,
          merge(existing, incoming) {
            if (!existing) return incoming;
            const merged = { ...incoming, edges: [...existing.edges, ...incoming.edges] };
            return merged;
          },
        },
      },
    },
  },
});

const useApolloContainer = () => {
  const { token } = useAuth();

  const authLink = useMemo(
    () =>
      setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
          },
        };
      }),
    [token]
  );

  const client = useMemo(
    () =>
      new ApolloClient({
        link: authLink.concat(httpLink),
        cache,
      }),
    [authLink]
  );

  useEffect(() => {
    console.log("initialized ApolloClient!");
  }, [client]);

  return client;
};

type ApolloProps = {
  children: ReactNode;
};

export const Apollo: VFC<ApolloProps> = ({ children }) => {
  const client = useApolloContainer();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
