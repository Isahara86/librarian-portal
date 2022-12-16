import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
export class AppFormComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Output() formSubmit = new EventEmitter<void>();
  private _onDestroy = new Subject<void>();

  public submit$ = new Subject<void>();

  constructor() {
    this.showPromptWhenHasUnsavedChanges = this.showPromptWhenHasUnsavedChanges.bind(this);
  }

  ngOnInit() {
    this.initFormSubmitDebounce();
    window.addEventListener('beforeunload', this.showPromptWhenHasUnsavedChanges);
  }

  /*
  prevent double submit
  * */
  private initFormSubmitDebounce(): void {
    const first = this.submit$.pipe(take(1));
    const rest = this.submit$.pipe(skipUntil(first), debounceTime(200));

    merge(first, rest)
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.formSubmit.emit());
  }

  showPromptWhenHasUnsavedChanges(e: BeforeUnloadEvent): string | undefined {
    if (!this.formGroup.touched) {
      return;
    }

    const confirmationMessage = 'o/';
    e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
    return confirmationMessage; // Gecko, WebKit, Chrome <34
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    window.removeEventListener('beforeunload', this.showPromptWhenHasUnsavedChanges);
  }
}
