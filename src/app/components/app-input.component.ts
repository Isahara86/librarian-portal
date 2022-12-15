import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-input[controlName]',
  template: ` <mat-form-field class="example-form-field" appearance="fill" style="width: 100%;">
    <mat-label *ngIf="label">{{ label }}</mat-label>
    <span *ngIf="prefix && userInput.value" matTextPrefix=>{{prefix}}</span>
    <input matInput type="{{ type }}" formControlName="{{ controlName }}" #userInput (input)="validateValue($event)" />
    <button
      *ngIf="userInput.value"
      matSuffix
      mat-icon-button
      aria-label="Clear"
      (click)="userInput.value = ''"
    >
      <mat-icon>close</mat-icon>
    </button>
  </mat-form-field>`,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class AppInputComponent {
  @Input() label?: string;
  @Input() type = 'text';
  @Input() inputType = 'text';
  @Input() prefix: string | null = null;
  @Input() controlName!: string;
  @ViewChild('input') inputRef!: ElementRef;

  validateValue(e: any) {
    const value = e.target?.value;
    if (this.inputType !== 'number' || !value) {
      return;
    }

    if (/\D/g.test(value)) {
      e.target.value = value.replace(/\D/g, '');
    }
  }
}
