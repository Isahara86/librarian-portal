import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Guid } from 'guid-typescript';
import { map, Observable, tap } from 'rxjs';
import {
  BooksListGQL
} from './_generated';

@Injectable({
  providedIn: 'root',
})
export class GraphQlService {
  constructor(
    private books: BooksListGQL,
  ) {
  }

  public findBooks() {
    return this.books.fetch({input: {offset: 0, limit: 10, query: null, authorIds: null, categoryIds: null}});
  }


}
