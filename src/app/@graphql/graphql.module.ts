import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';

// import { environment } from 'src/environments/environment';
// import { WebSocketLink } from '@apollo/client/link/ws';
// const GQL_WS_ENDPOINT = environment.graphqlWSEndpoint;

const uri = 'http://localhost:11300/graphql';

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

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
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

  const auth = setContext((operation, context) => {
    const token = localStorage.getItem('token');
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

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
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
  imports: [ApolloModule, CommonModule, HttpClientModule],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: createApollo,
    deps: [HttpLink],
  },],
  declarations: [],
})
export class GraphQLModule {
  // constructor(public apollo: Apollo) {
  //   this.initApolloWithHeaders({
  //     'x-hasura-admin-secret': '<your-admin-secret>',
  //   });
  //
  //   // Use this for Token based authentication
  //   //this.initApolloWithHeaders({ authorization: 'Bearer ' + token })
  // }
  //
  // private initApolloWithHeaders(headers: any) {
  //
  //   this.apollo.create(
  //     {
  //       uri: 'http://localhost:11300/graphql',
  //       cache: new InMemoryCache(),
  //     },
  //     'default'
  //   );
  // }
}
