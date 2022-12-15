import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InviteAdminGQL } from '../@graphql/_generated';
import { CommonModule } from '@angular/common';
import { AppInputComponent } from '../components/app-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AppFormComponent } from '../components/app-form.component';
import { DialogService } from '../services/dialog.service';

@Component({
  standalone: true,
  selector: 'app-invite-admin',
  template: `
    <app-form [formGroup]="createForm" (formSubmit)="onSubmit()">
      <h2>Invite new librarian</h2>

      <app-input controlName="login" label="login"></app-input>
      <app-input controlName="password" label="password"></app-input>
      <app-input controlName="confirmPassword" label="confirm password"></app-input>

      <mat-error *ngIf="error">{{ error }}</mat-error>
      <mat-error *ngIf="createForm.hasError('notSame')"
        >Password and confirmation did not match</mat-error
      >
      <button mat-flat-button color="primary" [disabled]="createForm.invalid">Invite</button>
    </app-form>
  `,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppInputComponent,
    MatFormFieldModule,
    MatButtonModule,
    AppFormComponent,
  ],
})
export class InviteAdminComponent {
  returnUrl!: string;
  error?: string;
  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    if (!pass) {
      return null;
    }
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  };

  createForm = this.formBuilder.group(
    {
      login: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.checkPasswords },
  );

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private inviteAdminGQL: InviteAdminGQL,
    private dialogService: DialogService,
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.createForm.controls;
  }

  async onSubmit() {
    // stop here if form is invalid
    if (this.createForm.invalid || !this.f.login.value || !this.f.password.value) {
      return;
    }

    this.dialogService
      .showLoadingUntil(
        this.inviteAdminGQL.mutate({
          input: {
            login: this.f.login.value,
            name: this.f.login.value,
            password: this.f.password.value,
          },
        }),
      )
      .then(() => this.router.navigate([this.returnUrl || '']))
      .catch(err => (this.error = err));
  }
}
