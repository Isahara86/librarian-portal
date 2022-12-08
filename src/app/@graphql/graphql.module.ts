import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
// @ts-ignore
import extractFiles from 'extract-files/extractFiles.mjs';
// @ts-ignore
import isExtractableFile from 'extract-files/isExtractableFile.mjs';
import { AuthService } from '../services/auth.service';

// import { environment } from 'src/environments/environment';
// import { WebSocketLink } from '@apollo/client/link/ws';
// const GQL_WS_ENDPOINT = environment.graphqlWSEndpoint;

// const uri = 'http://localhost:11300/graphql';
const uri = 'http://192.168.2.36:11300/graphql';

export function createApolloWithToken(httpLink: HttpLink, token: string): ApolloClientOptions<any>  {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => {
    // const token = localStorage.getItem('token');
    // let token = this.auth.getCachedAccessToken();

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }
  });

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

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri, extractFiles: (body) => extractFiles(body, isExtractableFile), })]);
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
  }

  return {
    link,
    cache,
    defaultOptions,
  }
}

function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

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

  const link = ApolloLink.from([basic, httpLink.create({ uri, extractFiles: (body) => extractFiles(body, isExtractableFile), })]);
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
  }

  return {
    link,
    cache,
    defaultOptions,
  }
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ApolloModule,
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: createApollo,
    deps: [HttpLink],
  },],
  declarations: [],
})
export class GraphQLModule {}
