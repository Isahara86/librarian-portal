import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateCategoryGQL } from '../@graphql/_generated';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppFormComponent } from '../components/app-form.component';
import { AppInputComponent } from '../components/app-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '../services/dialog.service';

@Component({
  standalone: true,
  template: `
    <app-form [formGroup]="createForm" (formSubmit)="onSubmit()">
      <h2>Create Category</h2>

      <app-input controlName="name" label="name"></app-input>

      <mat-error *ngIf="error">{{ error }}</mat-error>
      <button mat-flat-button color="primary" [disabled]="createForm.invalid">Create</button>
    </app-form>
  `,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppFormComponent,
    AppInputComponent,
    MatFormFieldModule,
    MatButtonModule,
  ],
})
export class CreateCategoryComponent {
  error?: string;
  createForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private createCategoryGQL: CreateCategoryGQL,
    private router: Router,
    private dialogService: DialogService,
  ) {}

  async onSubmit() {
    // stop here if form is invalid
    if (this.createForm.invalid || !this.createForm.controls.name.value) {
      return;
    }

    await this.dialogService
      .showLoadingUntil(
        this.createCategoryGQL.mutate({ input: { name: this.createForm.controls.name.value } }),
      )
      .then(() => this.router.navigate(['']))
      .catch(err => (this.error = err));
  }
}
