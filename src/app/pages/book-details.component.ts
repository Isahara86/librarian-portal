import { Component, NgZone, OnInit } from '@angular/core';
import { BookDetailsGQL, BookDetailsQuery } from '../@graphql/_generated';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { BookIconComponent } from '../components/book-icon.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  styles: [
    `
      @media screen and (max-width: 768px) {
        .desktop {
          display: none;
        }
      }

      @media screen and (min-width: 767px) {
        .mobile {
          display: none;
        }
      }
    `,
  ],
  template: `
    <div *ngIf="book">
      <div class="desktop" style="padding: 20px 50px;">
        <div style="display:flex;">
          <app-book-icon
            imgStyle="{{ 'max-height: 350px; width: auto;' }}"
            [jpeg]="book.previewJpeg"
            [webp]="book.previewWebp"
            [orig]="book.previewOrig"
          ></app-book-icon>
          <div style="margin-top: 40px; margin-left: 20px;">
            <div style="font-size: 40px">{{ book.name }}</div>
            <div style="margin-top: 20px;">Authors: {{ getAuthors() }}</div>
          </div>
        </div>

        <p style="margin: 20px 0;">Description: {{ book.description }}</p>

        <button
          mat-raised-button
          color="primary"
          *ngIf="authService.admin$.getValue()"
          (click)="router.navigate(['update-book', book.id])"
        >
          Edit
        </button>
      </div>
      <div class="mobile" style="padding: 20px 0;">
        <app-book-icon
          imgStyle="{{ 'width: 100vw; height: auto;' }}"
          [jpeg]="book.previewJpeg"
          [webp]="book.previewWebp"
          [orig]="book.previewOrig"
        ></app-book-icon>

        <div style="padding: 0 20px;">
          <div style="margin-top: 20px; font-size: 40px; line-height: 1;">{{ book.name }}</div>
          <div style="margin-top: 20px;">Authors: {{ getAuthors() }}</div>
          <p style="margin: 20px 0;">Description: {{ book.description }}</p>
          <button
            style="width: 100%"
            mat-raised-button
            color="primary"
            *ngIf="authService.admin$.getValue()"
            (click)="router.navigate(['update-book', book.id])"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule, BookIconComponent, MatButtonModule],
})
export class BookDetailsComponent implements OnInit {
  book?: BookDetailsQuery['bookDetails'];

  constructor(
    private bookDetailsGQL: BookDetailsGQL,
    public router: Router,
    private route: ActivatedRoute,
    readonly authService: AuthService,

    private ngZone: NgZone,
  ) {}

  async ngOnInit(): Promise<void> {
    const bookId = this.route.snapshot.paramMap.get('id');

    if (!bookId) {
      return;
    }

    const res = await firstValueFrom(this.bookDetailsGQL.fetch({ id: +bookId }));
    this.book = res.data.bookDetails;
  }

  getAuthors(): string {
    return this.book?.authors?.map(a => a.name).join(', ') || '';
  }
}
