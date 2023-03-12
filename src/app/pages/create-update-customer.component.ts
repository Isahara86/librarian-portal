import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreateBookReservationGQL,
  CreateCustomerGQL,
  CustomerDetailsGQL,
  CustomerDetailsQuery,
  Scalars,
  UpdateCustomerGQL,
} from '../@graphql/_generated';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppFormComponent } from '../components/app-form.component';
import { AppInputComponent } from '../components/app-input.component';
import { MatButtonModule } from '@angular/material/button';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { DialogService } from '../services/dialog.service';
import { firstValueFrom } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { AppTextareaComponent } from '../components/app-textarea.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AppFormComponent,
    AppInputComponent,
    MatButtonModule,
    MatInputModule,
    AppTextareaComponent,
  ],
  template: `
    <app-form [formGroup]="customerForm" (formSubmit)="onSubmit()">
      <h2>{{ existingCustomer ? 'Update' : 'Create' }} Customer</h2>

      <app-input controlName="name" label="name"></app-input>
      <app-input
        controlName="phone"
        label="phone"
        [prefix]="phonePrefix"
        [inputType]="'number'"
      ></app-input>
      <app-input controlName="email" label="email"></app-input>

      <app-textarea controlName="description" label="description"></app-textarea>

      <mat-error *ngIf="error">{{ error }}</mat-error>
      <button mat-flat-button color="primary" [disabled]="customerForm.invalid">
        {{ existingCustomer ? 'Update' : 'Create' }}
      </button>
    </app-form>
    <div style="padding: 20px">
      <button
        style="width: 100%;"
        mat-raised-button
        color="primary"
        *ngIf="existingCustomer"
        (click)="reserveBook()"
      >
        Reserve book
      </button>
    </div>
  `,
  styles: [],
})
export class CreateUpdateCustomerComponent implements OnInit {
  error?: string;
  existingCustomer?: CustomerDetailsQuery['customerDetails'];
  readonly phonePrefix = '+';
  returnUrl = '/customers-list';
  validatePhone: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const phone = group.value;
    if (!phone) {
      return null;
    }

    const isValid = isValidPhoneNumber(this.phonePrefix + phone);
    return isValid ? null : { notValid: true };
  };
  customerForm = this.formBuilder.group({
    name: new FormControl<string>('', { nonNullable: false, validators: Validators.required }),
    phone: new FormControl<number | null>(null, { validators: this.validatePhone }),
    email: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private createCustomerGQL: CreateCustomerGQL,
    private updateCustomerGQL: UpdateCustomerGQL,
    private customerDetailsGQL: CustomerDetailsGQL,
    private createBookReservationGQL: CreateBookReservationGQL,
    private dialogService: DialogService,
  ) {}

  async ngOnInit(): Promise<void> {
    const { customer, customerFindError } = await this.fetchCustomerDetails();
    this.existingCustomer = customer;
    this.error = customerFindError;

    this.fillCustomerForm();
  }

  async fetchCustomerDetails(): Promise<{
    customer?: CustomerDetailsQuery['customerDetails'];
    customerFindError?: string;
  }> {
    const result: {
      customer?: CustomerDetailsQuery['customerDetails'];
      customerFindError?: string;
    } = {
      customer: undefined,
      customerFindError: undefined,
    };

    const customerIdParam = this.route.snapshot.paramMap.get('customerId');
    if (!customerIdParam) {
      return result;
    }

    const customerIdFromRoute = Number(customerIdParam);

    if (Number.isInteger(customerIdFromRoute)) {
      const res = await firstValueFrom(this.customerDetailsGQL.fetch({ id: customerIdFromRoute }));
      if (res?.data) {
        result.customer = res?.data.customerDetails;
      } else {
        result.customerFindError = res?.error?.name;
      }
    } else {
      result.customerFindError = 'Invalid customer id';
    }

    return result;
  }

  fillCustomerForm(): void {
    if (!this.existingCustomer) {
      return;
    }

    const { name, phone, email, description } = this.existingCustomer;

    this.customerForm.controls.name.patchValue(name);
    this.customerForm.controls.phone.patchValue(phone ? +phone : null);
    this.customerForm.controls.email.patchValue(email || null);
    this.customerForm.controls.description.patchValue(description || null);
  }

  async onSubmit(): Promise<void> {
    const { name, phone, email, description } = this.customerForm.value;

    if (this.customerForm.invalid || !name) {
      return;
    }

    if (this.existingCustomer) {
      await this.dialogService
        .showLoadingUntil(
          this.updateCustomerGQL.mutate({
            input: {
              id: this.existingCustomer.id,
              name,
              phone: phone ? this.phonePrefix + phone : null,
              email,
              description,
            },
          }),
        )
        .then(() => this.router.navigate([this.returnUrl]))
        .catch(err => (this.error = err));
    } else {
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
        .then(() => this.router.navigate([this.returnUrl]))
        .catch(err => (this.error = err));
    }
  }

  async reserveBook(): Promise<void> {
    const bookInventoryId = await this.dialogService.choseBookInventory();

    if (!bookInventoryId || !this.existingCustomer) {
      return;
    }

    await this.dialogService
      .showLoadingUntil(
        this.createBookReservationGQL.mutate({
          input: {
            bookInventoryId,
            customerId: this.existingCustomer.id,
            description: 'Book reservation',
            endAt: Date.now(),
            startAt: Date.now(),
          },
        }),
      )
      .then(() => this.router.navigate([this.returnUrl]))
      .catch(err => (this.error = err));
  }
}
