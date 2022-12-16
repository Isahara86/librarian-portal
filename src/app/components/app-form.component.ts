import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, delay, merge, skipUntil, Subject, take, takeUntil } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
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
export class AppFormComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Output() formSubmit = new EventEmitter<void>();

  public submit$ = new Subject<void>();

  ngOnInit() {
    this.initFormSubmitDebounce();
  }

  /*
  prevent double submit
  * */
  private initFormSubmitDebounce(): void {
    const debounceMs = 400;

    const first = this.submit$.pipe(take(1));
    const rest = this.submit$.pipe(
      skipUntil(first.pipe(delay(debounceMs))),
      debounceTime(debounceMs),
    );

    merge(first, rest)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.formSubmit.emit());
  }
}
