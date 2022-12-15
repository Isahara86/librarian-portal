import { Component, OnInit } from '@angular/core';
import { BooksListGQL, BooksListQuery } from '../@graphql/_generated';
import { first } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  template: `
    <table style="margin: 20px;" mat-table [dataSource]="books" class="mat-elevation-z8">
      <!--- Note that these columns can be defined in any order.
            The actual rendered columns are set as a property on the row definition" -->

      <!-- Position Column -->
      <ng-container matColumnDef="previewUrl">
        <th mat-header-cell *matHeaderCellDef>Preview</th>
        <td mat-cell *matCellDef="let element">
          <img
            style="width: 50px; height: 50px;"
            mat-card-image
            [src]="element.previewUrl || '/assets/camera-icon.png'"
            alt="Photo of a Shiba Inu"
          />
        </td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let element">{{ element.name }}</td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let element">{{ element.description }}</td>
      </ng-container>

      <ng-container matColumnDef="isAvailable">
        <th mat-header-cell *matHeaderCellDef>isAvailable</th>
        <td mat-cell *matCellDef="let element">{{ element.isAvailable }}</td>
      </ng-container>

      <ng-container *ngIf="authService.admin$ | async" matColumnDef="Actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let element">
          <mat-icon [routerLink]="['update-book', element.id]" fontIcon="edit"></mat-icon>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="getColumns()"></tr>
      <tr mat-row *matRowDef="let row; columns: getColumns()"></tr>
    </table>
  `,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, RouterLink],
  styles: [
    `
      table {
        width: 100%;
      }
    `,
  ],
})
export class BooksListComponent implements OnInit {
  books: BooksListQuery['books'] = [];
  private displayedColumns: string[] = [
    'previewUrl',
    'name',
    'description',
    'isAvailable',
    'Actions',
  ];

  constructor(private booksListGQL: BooksListGQL, readonly authService: AuthService) {}

  ngOnInit(): void {
    this.booksListGQL
      .fetch({ input: { offset: 0, limit: 10 } })
      .pipe(first())
      .subscribe(res => {
        this.books = res.data.books;
      });
  }

  getColumns(): string[] {
    if (this.authService.admin$.getValue()) {
      return this.displayedColumns;
    }
    return this.displayedColumns.filter(c => c !== 'Actions');
  }
}
