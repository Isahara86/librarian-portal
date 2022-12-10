import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAuthorGQL } from '../@graphql/_generated';
import { Router } from '@angular/router';
import { AppInputComponent } from '../components/app-input.component';
import { AppFormComponent } from '../components/app-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { pagesCommonImports } from './pages-common-imports';

@Component({
  standalone: true,
  selector: 'app-create-author',
  template: `
    <app-form [formGroup]="createForm" (onSubmit)="onSubmit()">

      <h2>Create Author</h2>

      <app-input controlName="name" label="name"></app-input>

      <mat-error *ngIf="error">{{error}}</mat-error>
      <button mat-flat-button color="primary" [disabled]="loading || createForm.invalid">Create</button>

    </app-form>
  `,
  imports: [
    ...pagesCommonImports,
  ],
})
export class CreateAuthorComponent implements OnInit {
  loading = false;
  submitted = false;
  error?: string;

  value = 'Clear me';

  createForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private createAuthorGQL: CreateAuthorGQL,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.createForm.invalid) {
      return;
    }

    this.loading = true;
    await this.createAuthorGQL.mutate({input: {name: this.createForm.controls.name.value!}})
      .toPromise()
      .then(res => this.router.navigate(['']))
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }
}
