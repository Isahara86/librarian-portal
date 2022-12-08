import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form[formGroup][onSubmit]',
  template: `
    <form [formGroup]="formGroup"
          (ngSubmit)="onSubmit.emit()"
          style="display: flex; flex-direction: column; max-width: 400px; margin: auto;  padding: 20px;">
      <ng-content></ng-content>
    </form>`
})
export class AppFormComponent implements OnInit {

  @Input() formGroup!: FormGroup;
  @Output() onSubmit = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

}