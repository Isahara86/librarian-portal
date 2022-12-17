import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { BooksListGQL, BooksListQuery } from '../@graphql/_generated';
import { filter, firstValueFrom, map, pairwise, throttleTime } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from '../components/search.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatLineModule } from '@angular/material/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  template: `
    <app-search style="flex: 1" (valueChanged)="onSearchUpdate($event)"></app-search>

    <cdk-virtual-scroll-viewport #scroller class="content" itemSize="90">
      <mat-list-item *ngFor="let book of books" (click)="goToBookDetails(book.id)">
        <div style="display: flex; flex-direction: row; height: 90px; padding-left: 20px">
          <img
            style="max-height: 100%; width: auto;"
            mat-card-image
            [src]="book.previewUrl || '/assets/camera-icon.png'"
            alt="{{ book.previewUrl }}"
          />
          <h3 matLine style="padding-left: 20px;">{{ book.name }}</h3>
          <!--        <p matLine>-->
          <!--          <span> {{ book.description }} </span>-->
          <!--        </p>-->
        </div>
      </mat-list-item>
      <div class="spinner-item">
        <mat-progress-spinner *ngIf="hasMore" [mode]="'indeterminate'" [diameter]="50">
        </mat-progress-spinner>
        <p *ngIf="!hasMore">End</p>
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    SearchComponent,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatLineModule,
    ScrollingModule,
    MatProgressSpinnerModule,
  ],
  styles: [
    `
      .content {
        height: calc(100vh - 150px);
        overflow: auto;
      }
      .spinner-item {
        display: grid;
        place-items: center;
        margin-top: 10px;
      }
    `,
  ],
})
export class BooksListComponent implements OnInit, AfterViewInit {
  books: BooksListQuery['books'] = [];
  offset = 0;
  limit = 15;
  query?: string;
  hasMore = true;
  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  constructor(
    private booksListGQL: BooksListGQL,
    readonly authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.fetchBooks().then(() => this.fetchMore());
  }

  ngAfterViewInit(): void {
    this.initScroll();
  }

  initScroll() {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140 && this.hasMore),
        throttleTime(200),
      )
      .subscribe(() => this.ngZone.run(() => this.fetchMore()));
  }

  async onSearchUpdate(query?: string): Promise<void> {
    this.query = query;
    this.books = [];
    this.offset = 0;
    this.hasMore = true;
    return this.fetchBooks().then(() => this.fetchMore());
  }

  async fetchMore(): Promise<void> {
    this.offset += this.limit;
    return this.fetchBooks();
  }

  async fetchBooks(): Promise<void> {
    return firstValueFrom(
      this.booksListGQL.fetch({
        input: {
          offset: this.offset,
          limit: this.limit,
          ...(this.query && { query: this.query }),
        },
      }),
    ).then(res => {
      if (res.data) {
        this.books = [...this.books, ...res.data.books];
        if (res.data.books.length < this.limit) {
          this.hasMore = false;
        }
      }
    });
  }

  goToBookDetails(bookId: number): void {
    if (this.authService.admin$.getValue()) {
      this.router.navigate(['update-book', bookId]);
    }
  }
}
