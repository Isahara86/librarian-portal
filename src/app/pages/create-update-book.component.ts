import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AuthorsGQL,
  BookDetailsGQL,
  BookDetailsQuery,
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
import { BehaviorSubject, debounceTime, firstValueFrom, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppFormComponent } from '../components/app-form.component';
import { AppInputComponent } from '../components/app-input.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '../services/dialog.service';
import { AppTextareaComponent } from '../components/app-textarea.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageService } from '../services/storage.service';

@UntilDestroy()
@Component({
  standalone: true,
  template: `
    <app-form [formGroup]="bookForm" (formSubmit)="bookForUpdate ? updateBook() : createBook()">
      <h2>{{ bookForUpdate ? 'Update Book' : 'Create Book' }}</h2>

      <app-input controlName="name" label="name"></app-input>

      <app-multi-select
        [initialState$]="initialAuthorState$"
        [placeholder]="'Authors'"
        (valueUpdated)="stateChange$.next(null); selectedAuthors = $event"
        [createResource]="createAuthor"
      ></app-multi-select>

      <app-textarea controlName="description" label="description"></app-textarea>

      <app-multi-select
        [initialState$]="initialLanguageState$"
        [placeholder]="'Lang'"
        (valueUpdated)="stateChange$.next(null); selectedLangcodes = $event"
      ></app-multi-select>

      <app-multi-select
        [initialState$]="initialCategoryState$"
        [placeholder]="'Categories'"
        (valueUpdated)="stateChange$.next(null); selectedCategories = $event"
        [createResource]="createCategory"
      ></app-multi-select>

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
          alt="Book preview"
        />
      </mat-card>

      <!--      <ng-container formArrayName="inventories">-->
      <!--        <div>Inventories</div>-->
      <!--        <ng-container-->
      <!--          *ngFor="let inventory of this.createBookForm.controls.inventories.controls; let i = index"-->
      <!--        >-->
      <!--          <div [formGroupName]="i">-->
      <!--            <mat-form-field appearance="fill">-->
      <!--              <input-->
      <!--                matInput-->
      <!--                [value]="inventory.controls.serialNumber.value"-->
      <!--                formControlName="serialNumber"-->
      <!--                placeholder="Serial number"-->
      <!--              />-->
      <!--            </mat-form-field>-->

      <!--            <mat-icon-->
      <!--              *ngIf="checkIsInventoryNew(i)"-->
      <!--              class="delete-btn"-->
      <!--              (click)="removeInventory(i)"-->
      <!--            >-->
      <!--              delete_forever-->
      <!--            </mat-icon>-->
      <!--          </div>-->
      <!--        </ng-container>-->
      <!--      </ng-container>-->
      <!---->
      <!--      <div class="example-button-container">-->
      <!--        <button-->
      <!--          type="button"-->
      <!--          (click)="addInventory()"-->
      <!--          mat-mini-fab-->
      <!--          color="primary"-->
      <!--          aria-label="Example icon button with a plus one icon"-->
      <!--        >-->
      <!--          <mat-icon>plus_one</mat-icon>-->
      <!--        </button>-->
      <!--      </div>-->

      <mat-error *ngIf="error">{{ error }}</mat-error>
      <button style="margin: 20px 0;" mat-flat-button color="primary" [disabled]="bookForm.invalid">
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
    AppTextareaComponent,
  ],
})
export class CreateUpdateBookComponent implements OnInit, OnDestroy {
  error?: string;
  bookIdParam: string | null = null;
  bookForUpdate?: BookDetailsQuery['bookDetails'];
  bookForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    // inventories: this.formBuilder.array<FormGroup<{ serialNumber: FormControl<string | null> }>>(
    //   [this.buildFormInventoryItem()],
    //   Validators.required,
    // ),
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

  readonly stateChange$ = new Subject<unknown>();
  readonly CACHE_TTL_MS = 300000;

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
    private dialogService: DialogService,
    private storageService: StorageService,
  ) {
    this.createAuthor = this.createAuthor.bind(this);
    this.createCategory = this.createCategory.bind(this);
  }

  async ngOnInit(): Promise<void> {
    this.bookIdParam = this.route.snapshot.paramMap.get('bookId');

    const { book, bookFindError } = await this.fetchBookDetails();

    if (bookFindError) {
      this.error = bookFindError;
      return;
    }

    if (book) {
      this.bookForUpdate = book.bookDetails;
      this.fillBookForm(book.bookDetails);
    }

    await Promise.all([
      this.initLanguages(
        book?.bookDetails.languages?.map(({ code, name }) => ({ id: code, name })),
      ),
      this.initCategories(
        book?.bookDetails.categories.map(({ id, name }) => ({ id: id.toString(), name })),
      ),
      this.initAuthors(
        book?.bookDetails.authors.map(({ id, name }) => ({ id: id.toString(), name })),
      ),
    ]);

    this.restorePreservedState();
    this.subscribeStateChange();
  }

  ngOnDestroy() {
    this.storageService.remove(this.STORAGE_KEY);
  }

  get STORAGE_KEY(): string {
    return 'BOOK_FORM_STATE' + this.bookIdParam;
  }

  fillBookForm(book: BookDetailsQuery['bookDetails']) {
    this.bookForm.controls.name.patchValue(book.name);
    if (book.description) {
      this.bookForm.controls.description.patchValue(book.description);
    }

    this.preview = book.previewJpeg;

    // if (book.inventories.length) {
    //   this.createBookForm.controls.inventories.controls[0].patchValue(book.inventories[0]);
    //   for (let i = 1; i < book.inventories.length; i++) {
    //     this.addInventory(book.inventories[i].serialNumber);
    //   }
    // }
  }

  async fetchBookDetails(): Promise<{ book?: BookDetailsQuery; bookFindError?: string }> {
    const result: { book?: BookDetailsQuery; bookFindError?: string } = {
      book: undefined,
      bookFindError: undefined,
    };

    if (!this.bookIdParam) {
      return result;
    }

    const bookIdFromRoute = Number(this.bookIdParam);

    if (Number.isInteger(bookIdFromRoute)) {
      const res = await firstValueFrom(this.bookDetailsGQL.fetch({ id: bookIdFromRoute }));
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

  async initLanguages(selected: MultiselectItem[] = []): Promise<void> {
    const availableLanguages = await firstValueFrom(this.languagesGQL.fetch());
    const available =
      availableLanguages?.data.languages.map(({ code, name }) => ({
        id: code,
        name,
      })) || [];

    this.initialLanguageState$.next({ available, selected });
  }

  async initCategories(selected: MultiselectItem[] = []): Promise<void> {
    const categories = await firstValueFrom(
      this.categoriesGQL.fetch({ input: { offset: 0, limit: 100 } }),
    );
    const available =
      categories?.data.categories.map(({ id, name }) => ({
        id: id.toString(),
        name,
      })) || [];

    this.initialCategoryState$.next({ available, selected });
  }

  async initAuthors(selected: MultiselectItem[] = []): Promise<void> {
    const authors = await firstValueFrom(
      this.authorsGQL.fetch({ input: { offset: 0, limit: 500 } }),
    );
    const available =
      authors?.data.authors.map(({ id, name }) => ({ id: id.toString(), name })) || [];

    this.initialAuthorState$.next({ available, selected });
  }

  // addInventory(serialNumber = ''): void {
  //   const inventory = this.buildFormInventoryItem(serialNumber);
  //   this.createBookForm.controls.inventories.push(inventory);
  // }
  //
  // removeInventory(inventoryIndex: number): void {
  //   this.createBookForm.controls.inventories.removeAt(inventoryIndex);
  // }
  //
  // buildFormInventoryItem(serialNumber = '') {
  //   return this.formBuilder.group({
  //     serialNumber: [serialNumber, [Validators.required, Validators.minLength(3)]],
  //   });
  // }

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

    const formValues = this.bookForm.getRawValue();

    if (!formValues.name) {
      return;
    }

    // const existingInventories = this.bookForUpdate.inventories;

    const variables: UpdateBookMutationVariables = {
      input: {
        id: this.bookForUpdate.id,
        name: formValues.name,
        description: formValues.description,
        preview: this.file,
        authorIds: this.selectedAuthors.map(a => +a.id),
        categoryIds: this.selectedCategories.map(c => +c.id),
        newInventories: [],
        updatedInventories: [],
        // newInventories: formValues.inventories
        //   .filter((inv, i) => {
        //     return i + 1 > existingInventories.length && inv.serialNumber;
        //   })
        //   .map(inv => ({ serialNumber: inv.serialNumber as string })),
        // updatedInventories: existingInventories.map((inv, index) => ({
        //   id: inv.id,
        //   serialNumber: formValues.inventories[index].serialNumber as string,
        // })),
        languages: this.selectedLangcodes.map(l => l.id),
      },
    };

    await this.dialogService
      .showLoadingUntil(
        this.apollo.mutate<unknown>({
          mutation: this.updateBookGQL.document,
          variables,
          context: {
            useMultipart: true,
          },
        }),
      )
      .then(() => this.router.navigate(['']))
      .catch(err => (this.error = err));
  }

  async createBook() {
    const formValues = this.bookForm.getRawValue();

    if (!formValues.name) {
      return;
    }

    // const inventories: ReadonlyArray<BookInventoryCreateInput> = formValues.inventories.map(
    //   inv => ({ serialNumber: inv.serialNumber as string }),
    // );

    const variables: CreateBookMutationVariables = {
      input: {
        name: formValues.name,
        description: formValues.description,
        preview: this.file,
        authorIds: this.selectedAuthors.map(a => +a.id),
        categoryIds: this.selectedCategories.map(c => +c.id),
        inventories: [{ serialNumber: '111' }],
        languages: this.selectedLangcodes.map(l => l.id),
      },
    };

    await this.dialogService
      .showLoadingUntil(
        this.apollo.mutate<unknown>({
          mutation: this.createBookGQL.document,
          variables,
          context: {
            useMultipart: true,
          },
        }),
      )
      .then(() => this.router.navigate(['']))
      .catch(err => (this.error = err));

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
    await this.dialogService
      .showLoadingUntil(this.createAuthorGQL.mutate({ input: { name } }))
      .then(() => this.initAuthors())
      .catch(err => (this.error = err));
  }

  async createCategory(name: string): Promise<void> {
    await this.dialogService
      .showLoadingUntil(this.createCategoryGQL.mutate({ input: { name } }))
      .then(() => this.initCategories())
      .catch(err => (this.error = err));
  }

  checkIsInventoryNew(index: number): boolean {
    return !this.bookForUpdate?.inventories[index];
  }

  restorePreservedState(): void {
    const preservedState = this.storageService.get<State>(this.STORAGE_KEY);
    if (preservedState) {
      this.bookForm.controls.name.patchValue(preservedState.name);
      this.bookForm.controls.description.patchValue(preservedState.description);

      this.initialLanguageState$.next({
        ...this.initialLanguageState$.getValue(),
        selected: preservedState.selectedLangcodes,
      });
      this.initialCategoryState$.next({
        ...this.initialCategoryState$.getValue(),
        selected: preservedState.selectedAuthors,
      });
      this.initialAuthorState$.next({
        ...this.initialAuthorState$.getValue(),
        selected: preservedState.selectedAuthors,
      });
    }
  }

  subscribeStateChange(): void {
    this.bookForm.valueChanges.subscribe(this.stateChange$);

    this.stateChange$
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() =>
        this.storageService.set(this.STORAGE_KEY, this.getState(), Date.now() + this.CACHE_TTL_MS),
      );
  }

  getState(): State {
    return {
      name: this.bookForm.controls.name.value,
      description: this.bookForm.controls.description.value,
      // preview: this.file,
      selectedAuthors: this.selectedAuthors,
      selectedCategories: this.selectedCategories,
      selectedLangcodes: this.selectedLangcodes,
    };
  }
}

interface State {
  name: string | null;
  description: string | null;
  // preview: this.file,
  selectedAuthors: MultiselectItem[];
  selectedCategories: MultiselectItem[];
  selectedLangcodes: MultiselectItem[];
}
