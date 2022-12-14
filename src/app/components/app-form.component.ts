import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, merge, skipUntil, Subject, take, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-form[formGroup][formSubmit]',
  template: ` <form
    [formGroup]="formGroup"
    (ngSubmit)="submit$.next()"
    style="display: flex; flex-direction: column; max-width: 400px; margin: auto;  padding: 20px;"
  >
    <ng-content></ng-content>
  </form>`,
  imports: [ReactiveFormsModule],
})
export class AppFormComponent implements OnDestroy {
  @Input() formGroup!: FormGroup;
  @Output() formSubmit = new EventEmitter<void>();
  private _onDestroy = new Subject<void>();

  public submit$ = new Subject<void>();

  constructor() {
    const first = this.submit$.pipe(take(1));
    const rest = this.submit$.pipe(skipUntil(first), debounceTime(200));

    merge(first, rest)
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.formSubmit.emit());
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
