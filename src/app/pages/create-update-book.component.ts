import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AuthorsGQL,
  BookDetailsGQL,
  BookDetailsQuery,
  BookInventoryCreateInput,
  CategoriesGQL,
  CreateAuthorGQL,
  CreateBookGQL,
  CreateBookMutationVariables,
  CreateCategoryGQL,
  LanguagesGQL,
  UpdateBookGQL,
  UpdateBookMutationVariables,
} from '../@graphql/_generated';
import { Apollo } from 'apollo-angular';
import {
  MultiSelectComponent,
  MultiselectInitialState,
  MultiselectItem,
} from '../components/multi-select.component';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppFormComponent } from '../components/app-form.component';
import { AppInputComponent } from '../components/app-input.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-create-book',
  template: `
    <app-form
      [formGroup]="createBookForm"
      (formSubmit)="bookForUpdate ? updateBook() : createBook()"
    >
      <h2>{{ bookForUpdate ? 'Update Book' : 'Create Book' }}</h2>

      <app-input controlName="name" label="name"></app-input>

      <app-input controlName="description" label="description"></app-input>

      <app-multi-select
        [initialState$]="initialLanguageState$"
        [placeholder]="'Lang'"
        (valueUpdated)="selectedLangcodes = $event"
      ></app-multi-select>
      <app-multi-select
        [initialState$]="initialCategoryState$"
        [placeholder]="'Categories'"
        (valueUpdated)="selectedCategories = $event"
        [createResource]="createCategory"
      ></app-multi-select>
      <app-multi-select
        [initialState$]="initialAuthorState$"
        [placeholder]="'Authors'"
        (valueUpdated)="selectedAuthors = $event"
        [createResource]="createAuthor"
      ></app-multi-select>

      <!-- File Input -->
      <div class="form-group"></div>

      <mat-card
        style="margin-bottom: 10px; height: 230px; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center;"
      >
        <input
          style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
          type="file"
          class="file"
          (change)="updateFile($event)"
        />
        <img
          style="max-height: 100%; width: auto;"
          mat-card-image
          [src]="preview && preview !== null ? preview : '/assets/camera-icon.png'"
          alt="Photo of a Shiba Inu"
        />
      </mat-card>

      <ng-container formArrayName="inventories">
        <div>Inventories</div>
        <ng-container
          *ngFor="let inventory of this.createBookForm.controls.inventories.controls; let i = index"
        >
          <div [formGroupName]="i">
            <mat-form-field appearance="fill">
              <input
                matInput
                [value]="inventory.controls.serialNumber.value"
                formControlName="serialNumber"
                placeholder="Serial number"
              />
            </mat-form-field>

            <mat-icon
              *ngIf="checkIsInventoryNew(i)"
              class="delete-btn"
              (click)="removeInventory(i)"
            >
              delete_forever
            </mat-icon>
          </div>
        </ng-container>
      </ng-container>

      <div class="example-button-container">
        <button
          type="button"
          (click)="addInventory()"
          mat-mini-fab
          color="primary"
          aria-label="Example icon button with a plus one icon"
        >
          <mat-icon>plus_one</mat-icon>
        </button>
      </div>

      <mat-error *ngIf="error">{{ error }}</mat-error>
      <button
        style="margin: 20px 0;"
        mat-flat-button
        color="primary"
        [disabled]="loading || createBookForm.invalid"
      >
        {{ bookForUpdate ? 'Save' : 'Create' }}
      </button>
    </app-form>
  `,
  styles: [
    `
      div.fileinputs {
        position: relative;
      }

      div.fakefile {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }

      input.file {
        position: relative;
        text-align: right;
        -moz-opacity: 0;
        opacity: 0;
        z-index: 2;
      }
    `,
  ],
  imports: [
    CommonModule,
    AppFormComponent,
    AppInputComponent,
    MultiSelectComponent,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class CreateUpdateBookComponent implements OnInit {
  loading = false;
  error?: string;
  bookForUpdate?: BookDetailsQuery;
  createBookForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    inventories: this.formBuilder.array<FormGroup<{ serialNumber: FormControl<string | null> }>>(
      [this.buildFormInventoryItem()],
      Validators.required,
    ),
  });

  initialLanguageState$ = new BehaviorSubject<MultiselectInitialState>({
    available: [],
    selected: [],
  });
  selectedLangcodes: MultiselectItem[] = [];
  initialCategoryState$ = new BehaviorSubject<MultiselectInitialState>({
    available: [],
    selected: [],
  });
  selectedCategories: MultiselectItem[] = [];
  initialAuthorState$ = new BehaviorSubject<MultiselectInitialState>({
    available: [],
    selected: [],
  });
  selectedAuthors: MultiselectItem[] = [];

  file?: File;
  preview?: string | null;

  constructor(
    private formBuilder: FormBuilder,
    private createBookGQL: CreateBookGQL,
    private updateBookGQL: UpdateBookGQL,
    private bookDetailsGQL: BookDetailsGQL,
    private languagesGQL: LanguagesGQL,
    private categoriesGQL: CategoriesGQL,
    private authorsGQL: AuthorsGQL,
    private createAuthorGQL: CreateAuthorGQL,
    private createCategoryGQL: CreateCategoryGQL,
    private apollo: Apollo,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.createAuthor = this.createAuthor.bind(this);
    this.createCategory = this.createCategory.bind(this);
  }

  async ngOnInit(): Promise<void> {
    const { book, bookFindError } = await this.fetchBookDetails();

    if (bookFindError) {
      this.error = bookFindError;
      return;
    }

    if (book) {
      this.bookForUpdate = book;
      this.fillBookForm(book);
    }

    await Promise.all([
      this.fetchLanguages(
        book?.bookDetails.languages?.map(({ code, name }) => ({ id: code, name })),
      ),
      this.fetchCategories(
        book?.bookDetails.categories.map(({ id, name }) => ({ id: id.toString(), name })),
      ),
      this.fetchAuthors(
        book?.bookDetails.authors.map(({ id, name }) => ({ id: id.toString(), name })),
      ),
    ]);
  }

  fillBookForm(book: BookDetailsQuery) {
    this.createBookForm.controls.name.patchValue(book.bookDetails.name);
    if (book.bookDetails.description) {
      this.createBookForm.controls.description.patchValue(book.bookDetails.description);
    }

    this.preview = book.bookDetails.previewUrl;

    if (book.bookDetails.inventories.length) {
      this.createBookForm.controls.inventories.controls[0].patchValue(
        book.bookDetails.inventories[0],
      );
      for (let i = 1; i < book.bookDetails.inventories.length; i++) {
        this.addInventory(book.bookDetails.inventories[i].serialNumber);
      }
    }
  }

  async fetchBookDetails(): Promise<{ book?: BookDetailsQuery; bookFindError?: string }> {
    const result: { book?: BookDetailsQuery; bookFindError?: string } = {
      book: undefined,
      bookFindError: undefined,
    };

    const bookIdParam = this.route.snapshot.paramMap.get('bookId');
    if (!bookIdParam) {
      return result;
    }

    const bookIdFromRoute = Number(bookIdParam);

    if (Number.isInteger(bookIdFromRoute)) {
      const res = await this.bookDetailsGQL.fetch({ id: bookIdFromRoute }).toPromise();
      if (res?.data) {
        result.book = res?.data;
      } else {
        result.bookFindError = res?.error?.name;
      }
    } else {
      result.bookFindError = 'Invalid book id';
    }

    return result;
  }

  async fetchLanguages(selected: MultiselectItem[] = []): Promise<void> {
    const availableLanguages = await this.languagesGQL.fetch().toPromise();
    const available =
      availableLanguages?.data.languages.map(({ code, name }) => ({
        id: code,
        name,
      })) || [];
    this.initialLanguageState$.next({ available, selected });
  }

  async fetchCategories(selected: MultiselectItem[] = []): Promise<void> {
    const categories = await this.categoriesGQL
      .fetch({ input: { offset: 0, limit: 100 } })
      .toPromise();
    const available =
      categories?.data.categories.map(({ id, name }) => ({
        id: id.toString(),
        name,
      })) || [];

    this.initialCategoryState$.next({ available, selected });
  }

  async fetchAuthors(selected: MultiselectItem[] = []): Promise<void> {
    const authors = await this.authorsGQL.fetch({ input: { offset: 0, limit: 500 } }).toPromise();
    const available =
      authors?.data.authors.map(({ id, name }) => ({ id: id.toString(), name })) || [];
    this.initialAuthorState$.next({ available, selected });
  }

  addInventory(serialNumber = ''): void {
    const inventory = this.buildFormInventoryItem(serialNumber);
    this.createBookForm.controls.inventories.push(inventory);
  }

  buildFormInventoryItem(serialNumber = '') {
    return this.formBuilder.group({
      serialNumber: [serialNumber, [Validators.required, Validators.minLength(3)]],
    });
  }

  removeInventory(inventoryIndex: number): void {
    this.createBookForm.controls.inventories.removeAt(inventoryIndex);
  }

  updateFile(event: unknown) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.file = (event?.target as HTMLInputElement)?.files[0];
    if (!this.file) {
      this.preview = undefined;
      return;
    }
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }

  async updateBook(): Promise<void> {
    if (!this.bookForUpdate) {
      return;
    }

    const formValues = this.createBookForm.getRawValue();

    if (!formValues.name) {
      return;
    }

    const existingInventories = this.bookForUpdate.bookDetails.inventories;

    const variables: UpdateBookMutationVariables = {
      input: {
        id: this.bookForUpdate.bookDetails.id,
        name: formValues.name,
        description: formValues.description,
        preview: this.file,
        authorIds: this.selectedAuthors.map(a => +a.id),
        categoryIds: this.selectedCategories.map(c => +c.id),
        newInventories: formValues.inventories
          .filter((inv, i) => {
            console.log(
              i + 1 > existingInventories.length && inv.serialNumber,
              i + 1,
              existingInventories.length,
              inv.serialNumber,
            );
            return i + 1 > existingInventories.length && inv.serialNumber;
          })
          .map(inv => ({ serialNumber: inv.serialNumber as string })),
        updatedInventories: existingInventories.map((inv, index) => ({
          id: inv.id,
          serialNumber: formValues.inventories[index].serialNumber as string,
        })),
        languages: this.selectedLangcodes.map(l => l.id),
      },
    };

    await this.apollo
      .mutate<unknown>({
        mutation: this.updateBookGQL.document,
        variables,
        context: {
          useMultipart: true,
        },
      })
      .toPromise()
      .then(() => this.router.navigate(['']))
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }

  async createBook() {
    const formValues = this.createBookForm.getRawValue();

    if (!formValues.name) {
      return;
    }

    const inventories: ReadonlyArray<BookInventoryCreateInput> = formValues.inventories.map(
      inv => ({ serialNumber: inv.serialNumber as string }),
    );

    const variables: CreateBookMutationVariables = {
      input: {
        name: formValues.name,
        description: formValues.description,
        preview: this.file,
        authorIds: this.selectedAuthors.map(a => +a.id),
        categoryIds: this.selectedCategories.map(c => +c.id),
        inventories,
        languages: this.selectedLangcodes.map(l => l.id),
      },
    };

    await this.apollo
      .mutate<unknown>({
        mutation: this.createBookGQL.document,
        variables,
        context: {
          useMultipart: true,
        },
      })
      .toPromise()
      .then(() => this.router.navigate(['']))
      .catch(err => {
        this.error = err;
        this.loading = false;
      });

    // // TODO find solution
    // console.log(res);
    //
    //  await this.createBookGQL.mutate({
    //    input: {
    //      name: formValues.name!,
    //      description: formValues.description,
    //      preview: this.file,
    //      authorIds: [],
    //      categoryIds: [],
    //      inventories: [],
    //      languages: [],
    //    }
    //  }).toPromise();
  }

  async createAuthor(name: string): Promise<void> {
    await this.createAuthorGQL
      .mutate({ input: { name } })
      .toPromise()
      .then(() => this.fetchAuthors())
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }

  async createCategory(name: string): Promise<void> {
    await this.createCategoryGQL
      .mutate({ input: { name } })
      .toPromise()
      .then(() => this.fetchCategories())
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }

  checkIsInventoryNew(index: number): boolean {
    return !this.bookForUpdate?.bookDetails.inventories[index];
  }
}
