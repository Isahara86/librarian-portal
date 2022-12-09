import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InviteAdminGQL } from '../../@graphql/_generated';

@Component({
  selector: 'app-invite-admin',
  templateUrl: './invite-admin.component.html',
})
export class InviteAdminComponent implements OnInit {
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
    private inviteAdminGQL: InviteAdminGQL,
  ) {
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
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
    await this.inviteAdminGQL.mutate({input: {login: this.f.login.value!, name: this.f.login.value!, password: this.f.password.value!}} )
      .toPromise()
      .then(res => this.router.navigate([this.returnUrl]))
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }
}
