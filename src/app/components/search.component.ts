import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatIconModule } from '@angular/material/icon';

@UntilDestroy()
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <mat-form-field style="margin-bottom: -1.25em; width: 100%;">
      <input type="text" matInput placeholder="Search" name="search" #searchInput />
      <button matSuffix mat-button><mat-icon>search</mat-icon></button>
    </mat-form-field>
  `,
  styles: [],
})
export class SearchComponent implements AfterViewInit {
  @Output() valueChanged = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(150),
        distinctUntilChanged(),
        untilDestroyed(this),
        tap(() => {
          this.valueChanged.emit(this.searchInput.nativeElement.value);
        }),
      )
      .subscribe();
  }
}
