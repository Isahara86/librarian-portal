import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Guid } from 'guid-typescript';
import { map, Observable, tap } from 'rxjs';
import {
  AdminLoginGQL, AdminLoginMutationVariables,
  BooksListGQL
} from './_generated';
import { createApolloWithToken } from './graphql.module';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

@Injectable({
  providedIn: 'root',
})
export class GraphQlService {
  constructor(
    private books: BooksListGQL,
    private adminLoginGQL: AdminLoginGQL,
    private readonly httpLink: HttpLink,
    private apollo: Apollo,
  ) {
  }

  public findBooks() {
    return this.books.fetch({input: {offset: 0, limit: 10}});
  }

  public async adminLogin(variables: AdminLoginMutationVariables) {
    const res = await this.adminLoginGQL.mutate(variables).toPromise();

    const token = res?.data?.adminLogin.token;
    if (!token) {
      throw new Error();
    }

    await this.apollo.removeClient();
    await this.apollo.create(createApolloWithToken(this.httpLink, token));
  }


}
