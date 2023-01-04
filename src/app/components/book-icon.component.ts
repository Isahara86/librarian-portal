import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <picture>
      <source *ngIf="webp" [srcset]="webp" type="image/webp" />
      <source *ngIf="jpeg" [srcset]="jpeg" type="image/jpeg" />
      <img [style]="imgStyle" [src]="orig || '/assets/camera-icon.png'" alt="Book photo" />
    </picture>
  `,
  styles: [],
})
export class BookIconComponent {
  @Input() public jpeg?: string | null;
  @Input() public webp?: string | null;
  @Input() public orig?: string | null;
  @Input() public imgStyle?: string;
}
