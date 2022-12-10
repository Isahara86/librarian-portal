import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InviteAdminGQL } from '../@graphql/_generated';
import { pagesCommonImports } from './pages-common-imports';

@Component({
  standalone: true,
  selector: 'app-invite-admin',
  template: `
    <app-form [formGroup]="createForm" (onSubmit)="onSubmit()">

      <h2>Invite new librarian</h2>

      <app-input controlName="login" label="login"></app-input>
      <app-input controlName="password" label="password"></app-input>
      <app-input controlName="confirmPassword" label="confirm password"></app-input>

      <mat-error *ngIf="error">{{error}}</mat-error>
      <mat-error *ngIf="createForm.hasError('notSame')">Password and confirmation did not match</mat-error>
      <button mat-flat-button color="primary" [disabled]="loading || createForm.invalid">Invite</button>

    </app-form>
  `,
  imports: [
    ...pagesCommonImports,
  ]
})
export class InviteAdminComponent implements OnInit {
  loading = false;
  submitted = false;
  returnUrl!: string;
  error?: string;
  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    if (!pass) {
      return null;
    }
    let confirmPass = group.get('confirmPassword')?.value
    return pass === confirmPass ? null : {notSame: true}
  }

  createForm = this.formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {validators: this.checkPasswords});


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private inviteAdminGQL: InviteAdminGQL,
  ) {
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.createForm.controls;
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.createForm.invalid) {
      return;
    }

    this.loading = true;
    await this.inviteAdminGQL.mutate({
      input: {
        login: this.f.login.value!,
        name: this.f.login.value!,
        password: this.f.password.value!
      }
    })
      .toPromise()
      .then(res => this.router.navigate([this.returnUrl]))
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }
}
