import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
