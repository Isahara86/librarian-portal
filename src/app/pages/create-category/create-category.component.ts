import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateCategoryGQL } from '../../@graphql/_generated';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html'
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
