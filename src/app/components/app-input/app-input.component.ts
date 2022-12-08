import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-input[control][controlName]',
  template: `
    <mat-form-field class="example-form-field" appearance="fill" style="width: 100%;">
      <mat-label *ngIf="controlName">{{controlName}}</mat-label>
      <input matInput type="{{type}}" formControlName="{{controlName}}">
      <button *ngIf="control.value" matSuffix mat-icon-button aria-label="Clear" (click)="control.setValue('')">
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
  @Input() control!: FormControl;
  @Input() type: string = 'text';
  @Input() controlName!: string;

  @ViewChild('input') inputRef!: ElementRef;


  constructor() {
  }

  ngOnInit(): void {
  }

}
