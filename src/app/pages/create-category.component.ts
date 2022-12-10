import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateCategoryGQL } from '../@graphql/_generated';
import { Router } from '@angular/router';
import { pagesCommonImports } from './pages-common-imports';

@Component({
  standalone: true,
  selector: 'app-create-category',
  template: `
    <app-form [formGroup]="createForm" (onSubmit)="onSubmit()">

      <h2>Create Category</h2>

      <app-input controlName="name" label="name"></app-input>

      <mat-error *ngIf="error">{{error}}</mat-error>
      <button mat-flat-button color="primary" [disabled]="loading || createForm.invalid">Create</button>

    </app-form>
  `,
  imports: [
    ...pagesCommonImports,
  ],
})
export class CreateCategoryComponent implements OnInit {
  loading = false;
  submitted = false;
  error?: string;

  createForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private createCategoryGQL: CreateCategoryGQL,
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
    await this.createCategoryGQL.mutate({input: {name: this.createForm.controls.name.value!}})
      .toPromise()
      .then(res => this.router.navigate(['']))
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }

}
