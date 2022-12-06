import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Apollo, ApolloModule } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';

// import { environment } from 'src/environments/environment';
// import { WebSocketLink } from '@apollo/client/link/ws';
// const GQL_WS_ENDPOINT = environment.graphqlWSEndpoint;

@NgModule({
  imports: [ApolloModule, CommonModule, HttpClientModule],
  providers: [],
  declarations: [],
})
export class GraphQLModule {
  constructor(public apollo: Apollo) {
    this.initApolloWithHeaders({
      'x-hasura-admin-secret': '<your-admin-secret>',
    });

    // Use this for Token based authentication
    //this.initApolloWithHeaders({ authorization: 'Bearer ' + token })
  }

  private initApolloWithHeaders(headers: any) {

    this.apollo.create(
      {
        uri: 'http://localhost:11300/graphql',
        cache: new InMemoryCache(),
      },
      'default'
    );
  }
}
