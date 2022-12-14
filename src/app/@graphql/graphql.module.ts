import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import {
  ApolloClientOptions,
  ApolloLink,
  DefaultOptions,
  InMemoryCache,
} from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import extractFiles from 'extract-files/extractFiles.mjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import isExtractableFile from 'extract-files/isExtractableFile.mjs';
import { environment } from '../../environments/environment';
// import { onError } from '@apollo/client/link/error';
// import { asyncMap } from '@apollo/client/utilities';
// import { environment } from 'src/environments/environment';
// import { WebSocketLink } from '@apollo/client/link/ws';
// const GQL_WS_ENDPOINT = environment.graphqlWSEndpoint;

export function buildApolloConfig(
  httpLink: HttpLink,
  token?: string,
): ApolloClientOptions<unknown> {
  // // autho refresh token
  // const auth = setContext(async(_, { headers }) => {
  //   // Grab token if there is one in storage or hasn't expired
  //   let token = this.auth.getCachedAccessToken();
  //
  //   if (!token) {
  //     // An observable to fetch a new token
  //     // Converted .toPromise()
  //     await this.auth.acquireToken().toPromise();
  //
  //     // Set new token to the response (adal puts the new token in storage when fetched)
  //     token = this.auth.getCachedAccessToken();
  //   }
  //   // Return the headers as usual
  //   return {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  // });

  // const loggerLink = new ApolloLink((operation, forward) => {
  //   console.log('apollo request', new Date().toISOString());
  //   return asyncMap(forward(operation), async response => {
  //     // let data = response.data;
  //     // if (data.price && data.currency === "USD") {
  //     //   data.price = await usdToEur(data.price);
  //     //   data.currency = "EUR";
  //     // }
  //     console.log('apollo response', new Date().toISOString());
  //
  //     return response;
  //   });
  // });

  // const errorLink = onError(({ networkError }) => {
  //   console.log('Graphql errorLink', new Date().toISOString());
  //   // if (networkError.statusCode === 401) logout();
  // });

  const authContext = setContext(() => {
    // const token = localStorage.getItem('token');
    // let token = this.auth.getCachedAccessToken();

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  });

  const link = ApolloLink.from([
    // loggerLink,
    // errorLink,
    authContext,
    httpLink.create({
      uri: environment.API_URL,
      extractFiles: body => extractFiles(body, isExtractableFile),
    }),
  ]);
  const cache = new InMemoryCache();

  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  return {
    link,
    cache,
    defaultOptions,
  };
}

@NgModule({
  imports: [HttpClientModule, ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: buildApolloConfig,
      deps: [HttpLink],
    },
  ],
  declarations: [],
})
export class GraphQLModule {}
