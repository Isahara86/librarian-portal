import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-input[controlName]',
  template: `
    <mat-form-field class="example-form-field" appearance="fill" style="width: 100%;">
      <mat-label *ngIf="label">{{label}}</mat-label>
      <input matInput type="{{type}}" formControlName="{{controlName}}" #userInput>
      <button *ngIf="userInput.value" matSuffix mat-icon-button aria-label="Clear" (click)="userInput.value = ''">
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>`,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AppInputComponent implements OnInit {
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() controlName!: string;

  @ViewChild('input') inputRef!: ElementRef;


  constructor() {
  }

  ngOnInit(): void {
  }

}
