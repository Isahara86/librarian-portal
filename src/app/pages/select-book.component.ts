import {
  AfterViewInit,
  Component,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BookDetailsGQL, BooksListGQL, BooksListQuery } from '../@graphql/_generated';
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
import { BookIconComponent } from '../components/book-icon.component';

@Component({
  standalone: true,
  template: `
    <button
      style="width: 100%;"
      mat-raised-button
      color="primary"
      (click)="submitClicked.emit(null)"
    >
      Cancel
    </button>
    <app-search style="flex: 1" (valueChanged)="onSearchUpdate($event)"></app-search>

    <cdk-virtual-scroll-viewport style="background: white" #scroller class="content" itemSize="90">
      <mat-list-item *ngFor="let book of books" (click)="selectBook(book.id)">
        <div
          [style.opacity]="book.isAvailable ? 1 : 0.5"
          style="display: flex; flex-direction: row; height: 90px; padding-left: 20px; padding-top: 10px;"
        >
          <app-book-icon
            imgStyle="{{ 'max-height: 100%; width: auto;' }}"
            [jpeg]="book.previewJpegThumbnail"
            [webp]="book.previewWebpThumbnail"
            [orig]="book.previewOrig"
          ></app-book-icon>
          <!--          <img-->
          <!--            style="max-height: 100%; width: auto;"-->
          <!--            mat-card-image-->
          <!--            [src]="book.previewUrl || '/assets/camera-icon.png'"-->
          <!--            alt="{{ book.previewUrl }}"-->
          <!--          />-->
          <div style="padding-left: 20px;">
            <div style="font-weight: bolder;">{{ book.name }}</div>
            <div>Authors: {{ getAuthors(book.authors) }}</div>
          </div>
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
    BookIconComponent,
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
export class SelectBookComponent implements OnInit, AfterViewInit {
  @Output() submitClicked = new EventEmitter<number | null>();

  books: BooksListQuery['books'] = [];
  offset = 0;
  limit = 15;
  query?: string;
  hasMore = true;
  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  constructor(
    private booksListGQL: BooksListGQL,
    private bookDetailsGQL: BookDetailsGQL,
    readonly authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.fetchMoreBooks();
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
      .subscribe(() => this.ngZone.run(() => this.fetchMoreBooks()));
  }

  async onSearchUpdate(query?: string): Promise<void> {
    this.query = query;
    this.books = [];
    this.offset = 0;
    this.hasMore = true;
    return this.fetchMoreBooks();
  }

  async fetchMoreBooks(): Promise<void> {
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
        this.offset += this.limit;
        if (res.data.books.length < this.limit) {
          this.hasMore = false;
        }
      }
    });
  }

  async selectBook(bookId: number): Promise<void> {
    const res = await firstValueFrom(this.bookDetailsGQL.fetch({ id: bookId }));
    this.submitClicked.emit(res.data?.bookDetails.inventories[0]?.id);
  }

  getAuthors(authors?: ReadonlyArray<{ readonly name: string }>): string {
    return authors?.map(a => a.name).join(', ') || '';
  }
}
