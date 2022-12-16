import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-textarea[controlName]',
  template: `
    <mat-form-field appearance="fill" style="width: 100%;">
      <mat-label *ngIf="label">{{ label }}</mat-label>
      <textarea
        #userInput
        matInput
        formControlName="{{ controlName }}"
        cdkTextareaAutosize
        #autosize="cdkTextareaAutosize"
        cdkAutosizeMinRows="5"
        cdkAutosizeMaxRows="10"
      ></textarea>
      <button
        *ngIf="userInput.value"
        matSuffix
        mat-icon-button
        aria-label="Clear"
        (click)="userInput.value = ''"
      >
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>
  `,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class AppTextareaComponent {
  @Input() label?: string;
  @Input() controlName!: string;
}
