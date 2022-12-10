import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-input[controlName]',
  template: `
    <mat-form-field class="example-form-field" appearance="fill" style="width: 100%;">
      <mat-label *ngIf="label">{{label}}</mat-label>
      <input matInput type="{{type}}" formControlName="{{controlName}}" #userInput>
      <button *ngIf="userInput.value" matSuffix mat-icon-button aria-label="Clear" (click)="userInput.value = ''">
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>`,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    NgIf
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AppInputComponent {
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() controlName!: string;
  @ViewChild('input') inputRef!: ElementRef;
}
