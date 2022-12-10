import { Component, OnInit } from '@angular/core';
import { BooksListGQL } from '../@graphql/_generated';
import { first } from 'rxjs';
import { pagesCommonImports } from './pages-common-imports';

@Component({
  standalone: true,
  selector: 'app-books-list',
  template: `
    <table style="margin: 20px;" mat-table [dataSource]="books" class="mat-elevation-z8">
      <!--- Note that these columns can be defined in any order.
            The actual rendered columns are set as a property on the row definition" -->

      <!-- Position Column -->
      <ng-container matColumnDef="previewUrl">
        <th mat-header-cell *matHeaderCellDef> Preview</th>
        <td mat-cell *matCellDef="let element">
          <img style="width: 50px; height: 50px;" mat-card-image [src]="element.previewUrl || '/assets/camera-icon.png'"
               alt="Photo of a Shiba Inu">
        </td>
      </ng-container>

      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> Name</th>
        <td mat-cell *matCellDef="let element"> {{element.name}} </td>
      </ng-container>

      <!-- Weight Column -->
      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef> Description</th>
        <td mat-cell *matCellDef="let element"> {{element.description}} </td>
      </ng-container>

      <!-- Symbol Column -->
      <ng-container matColumnDef="isAvailable">
        <th mat-header-cell *matHeaderCellDef> isAvailable</th>
        <td mat-cell *matCellDef="let element"> {{element.isAvailable}} </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  imports: [
    ...pagesCommonImports,
  ],
  styles: [`
    table {
      width: 100%;
    }
  `]
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
