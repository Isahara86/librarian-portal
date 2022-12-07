import { Component, OnInit } from '@angular/core';
import { Book, BooksListGQL, BooksListQuery } from '../../@graphql/_generated';
import { first } from 'rxjs';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
  books: ReadonlyArray<{ readonly previewUrl?: string | null, readonly name: string, readonly description?: string | null, readonly isAvailable: boolean }> = [];
  displayedColumns: string[] = [
    'previewUrl',
    'name',
    'description',
    'isAvailable'
  ];

  constructor(private booksListGQL: BooksListGQL) {
  }

  ngOnInit(): void {
    this.booksListGQL.fetch({input: {offset: 0, limit: 10}}).pipe(first()).subscribe((res) => {
      this.books = res.data.books;
    })
  }

}
