import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AppFormComponent } from '../components/app-form.component';
import { AppInputComponent } from '../components/app-input.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MultiSelectComponent } from '../components/multi-select.component';

export const pagesCommonImports = [
  AppFormComponent,
  AppInputComponent,
  MatFormFieldModule,
  MatButtonModule,
  CommonModule,
  ReactiveFormsModule,
  MatTableModule,
  MatCardModule,
  MatInputModule,
  MatIconModule,
  MultiSelectComponent,
]
