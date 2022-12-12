import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form[formGroup][formSubmit]',
  template: ` <form
    [formGroup]="formGroup"
    (ngSubmit)="formSubmit.emit()"
    style="display: flex; flex-direction: column; max-width: 400px; margin: auto;  padding: 20px;"
  >
    <ng-content></ng-content>
  </form>`,
  imports: [ReactiveFormsModule],
})
export class AppFormComponent {
  @Input() formGroup!: FormGroup;
  @Output() formSubmit = new EventEmitter<void>();
}
