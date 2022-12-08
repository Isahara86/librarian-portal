import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateAuthorGQL } from '../../@graphql/_generated';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-author',
  templateUrl: './create-author.component.html',
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
