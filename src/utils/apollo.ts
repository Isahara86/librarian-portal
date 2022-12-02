import {
  ApolloClient,
  from,
  InMemoryCache,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { message } from 'antd';
import { tokenVar } from 'vars';

const httpLink = createUploadLink({ uri: process.env.API_URL });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message: msg }) => message.error(msg));
  }

  if (networkError) { message.error(networkError.message); }
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: tokenVar(),
  },
}));

const apolloClient = new ApolloClient({
  link: authLink.concat(from([errorLink, httpLink])),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
    },
    watchQuery: {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
    },
    mutate: { fetchPolicy: 'no-cache' },
  },
});

export default apolloClient;
