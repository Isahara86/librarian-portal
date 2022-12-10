import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { pagesCommonImports } from './pages-common-imports';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <app-form [formGroup]="loginForm" (onSubmit)="onSubmit()">
      <h2>Login</h2>

      <app-input controlName="login" label="login"></app-input>
      <app-input controlName="password" label="password"></app-input>

      <mat-error *ngIf="error">{{error}}</mat-error>
      <button mat-flat-button color="primary" [disabled]="loading || loginForm.invalid">Login</button>

    </app-form>
  `,
  imports: [
    ...pagesCommonImports,
  ]
})
export class LoginComponent implements OnInit {
  loading = false;
  submitted = false;
  returnUrl!: string;
  error?: string;

  loginForm = this.formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    await this.authService.adminLogin(this.f.login.value!, this.f.password.value!)
      .then(res => this.router.navigate([this.returnUrl]))
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }
}
