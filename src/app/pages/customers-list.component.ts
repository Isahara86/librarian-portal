import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersGQL, CustomersQuery } from '../@graphql/_generated';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  fromEvent,
  tap,
} from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div style="width: 100vw; display: flex;">
      <mat-form-field style="margin-bottom: -1.25em; flex: 1">
        <input type="tel" matInput placeholder="Search" name="search" #searchInput />
        <button matSuffix mat-button><mat-icon>search</mat-icon></button>
      </mat-form-field>
      <a
        [routerLink]="['/', 'create-customer']"
        mat-stroked-button
        color="primary"
        style="width: 80px; height: 56px"
      >
        Add
      </a>
    </div>

    <table mat-table [dataSource]="customers" class="mat-elevation-z8">
      <!--- Note that these columns can be defined in any order.
            The actual rendered columns are set as a property on the row definition" -->

      <!-- Position Column -->
      <ng-container matColumnDef="info">
        <th mat-header-cell *matHeaderCellDef>Info</th>
        <td mat-cell *matCellDef="let customer">
          <p class="customer-info" style="padding: 5px 0; font-weight: bold">{{ customer.name }}</p>
          <p class="customer-info" *ngIf="customer.phone">{{ customer.phone }}</p>
          <p class="customer-info" *ngIf="customer.email">{{ customer.email }}</p>
          <p class="customer-info" *ngIf="customer.description">{{ customer.description }}</p>
        </td>
      </ng-container>

      <ng-container matColumnDef="Actions">
        <th
          mat-header-cell
          *matHeaderCellDef
          style="text-align: center;vertical-align: middle;width: 50px;"
        >
          Actions
        </th>
        <td mat-cell *matCellDef="let customer" style="text-align: center;vertical-align: middle;">
          <mat-icon [routerLink]="['/', 'update-customer', customer.id]" fontIcon="edit"></mat-icon>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [
    `
      .customer-info {
        padding: 0;
        margin: 0;
      }
      table {
        width: 100vw;
      }
    `,
  ],
})
export class CustomersListComponent implements OnInit, AfterViewInit {
  customers: CustomersQuery['customers'] = [];
  displayedColumns: string[] = ['info', 'Actions'];
  search = '';
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private customersGQL: CustomersGQL) {}

  ngOnInit(): void {
    this.fetchCustomers().then();
  }

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(150),
        distinctUntilChanged(),
        untilDestroyed(this),
        tap(() => {
          this.fetchCustomers(this.searchInput.nativeElement.value).then();
        }),
      )
      .subscribe();
  }

  async fetchCustomers(query?: string): Promise<void> {
    const res = await firstValueFrom(
      this.customersGQL.fetch({
        input: {
          ...(query && { query }),
        },
      }),
    );

    if (res?.data.customers) {
      this.customers = res.data.customers;
    } else {
      console.log(res?.error);
    }
  }
}
