import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CreateCustomerGQL } from '../@graphql/_generated';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppFormComponent } from '../components/app-form.component';
import { AppInputComponent } from '../components/app-input.component';
import { MatButtonModule } from '@angular/material/button';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-create-update-customer',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AppFormComponent,
    AppInputComponent,
    MatButtonModule,
  ],
  template: `
    <app-form [formGroup]="customerForm" (formSubmit)="onSubmit()">
      <h2>Create Customer</h2>

      <app-input controlName="name" label="name"></app-input>
      <app-input controlName="phone" label="phone" [prefix]="phonePrefix"></app-input>
      <app-input controlName="email" label="email"></app-input>

      <mat-error *ngIf="error">{{ error }}</mat-error>
      <button mat-flat-button color="primary" [disabled]="customerForm.invalid">Create</button>
    </app-form>
  `,
  styles: [],
})
export class CreateUpdateCustomerComponent {
  error?: string;
  readonly phonePrefix = '+';
  validatePhone: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const phone = group.value;
    if (!phone) {
      return null;
    }

    const isValid = isValidPhoneNumber(this.phonePrefix + phone);
    return isValid ? null : { notValid: true };
  };
  customerForm = this.formBuilder.group({
    name: ['', Validators.required],
    phone: ['', this.validatePhone],
    email: [null],
    description: [null],
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private createCustomerGQL: CreateCustomerGQL,
    private dialogService: DialogService,
  ) {}

  async onSubmit(): Promise<void> {
    const { name, phone, email, description } = this.customerForm.value;

    if (this.customerForm.invalid || !name) {
      return;
    }

    await this.dialogService
      .showLoadingUntil(
        this.createCustomerGQL.mutate({
          input: {
            name,
            phone: phone ? this.phonePrefix + phone : null,
            email,
            description,
          },
        }),
      )
      .then(() => this.router.navigate(['/']))
      .catch(err => (this.error = err));
  }
}
