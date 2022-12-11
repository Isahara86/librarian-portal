import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AuthorsGQL,
  CategoriesGQL, CreateAuthorGQL,
  CreateBookGQL,
  CreateBookMutationVariables, CreateCategoryGQL,
  LanguagesGQL,
} from '../@graphql/_generated';
import { Apollo } from 'apollo-angular';
import { MultiselectInitialState, MultiselectItem } from '../components/multi-select.component';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { pagesCommonImports } from './pages-common-imports';

@Component({
  standalone: true,
  selector: 'app-create-book',
  template: `
    <app-form [formGroup]="createBookForm" (onSubmit)="createBook()">

      <h2>Create Book</h2>

      <app-input controlName="name" label="name"></app-input>

      <app-input controlName="description" label="description"></app-input>


      <app-multi-select [initialState$]="initialLanguageState$"
                        [placeholder]='"Lang"'
                        (onSelect)="selectedLangcodes = $event"
      ></app-multi-select>
      <app-multi-select [initialState$]="initialCategoryState$"
                        [placeholder]='"Categories"'
                        (onSelect)="selectedCategories = $event"
                        [createResource]="createCategory"
      ></app-multi-select>
      <app-multi-select [initialState$]="initialAuthorState$"
                        [placeholder]='"Authors"'
                        (onSelect)="selectedAuthors = $event"
                        [createResource]="createAuthor"
      ></app-multi-select>

      <!-- File Input -->
      <div class="form-group">
      </div>

      <mat-card
        style="margin-bottom: 10px; height: 230px; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center;">
        <input style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
               type="file" class="file"
               (change)="updateFile($event)"/>
        <img style="max-height: 100%; width: auto;" mat-card-image
             [src]="(preview && preview !== null) ? preview : '/assets/camera-icon.png'" alt="Photo of a Shiba Inu">
      </mat-card>


      <ng-container formArrayName="inventories">
        <div>Inventories</div>
        <ng-container *ngFor="let inventory of this.createBookForm.controls.inventories.controls; let i = index">
          <div [formGroupName]="i">

            <mat-form-field appearance="fill">
              <input matInput
                     formControlName="serialNumber"
                     placeholder="Serial number">
            </mat-form-field>

            <mat-icon class="delete-btn" (click)="removeInventory(i)">
              delete_forever
            </mat-icon>
          </div>
        </ng-container>
      </ng-container>

      <div class="example-button-container">
        <button type="button" (click)="addInventory()" mat-mini-fab color="primary"
                aria-label="Example icon button with a plus one icon">
          <mat-icon>plus_one</mat-icon>
        </button>
      </div>


      <mat-error *ngIf="error">{{error}}</mat-error>
      <button style="margin: 20px 0;"
              mat-flat-button color="primary"
              [disabled]="loading || createBookForm.invalid">
        Create
      </button>


    </app-form>
  `,
  styles: [`
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
  `],
  imports: [
    ...pagesCommonImports,
  ]
})
export class CreateBookComponent implements OnInit {
  loading = false;
  error?: string;
  createBookForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    inventories: this.formBuilder.array<FormGroup<{ serialNumber: FormControl<string | null>; }>>([
      this.formBuilder.group({
        serialNumber: ['', Validators.required],
      })
    ], Validators.required),
  });

  initialLanguageState$ = new BehaviorSubject<MultiselectInitialState>({available: [], selected: []});
  selectedLangcodes: MultiselectItem[] = [];
  initialCategoryState$ = new BehaviorSubject<MultiselectInitialState>({available: [], selected: []});
  selectedCategories: MultiselectItem[] = [];
  initialAuthorState$ = new BehaviorSubject<MultiselectInitialState>({available: [], selected: []});
  selectedAuthors: MultiselectItem[] = [];

  file?: File;
  preview?: string;

  constructor(
    private formBuilder: FormBuilder,
    private createBookGQL: CreateBookGQL,
    private languagesGQL: LanguagesGQL,
    private categoriesGQL: CategoriesGQL,
    private authorsGQL: AuthorsGQL,
    private createAuthorGQL: CreateAuthorGQL,
    private createCategoryGQL: CreateCategoryGQL,
    private apollo: Apollo,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.createAuthor = this.createAuthor.bind(this);
    this.createCategory = this.createCategory.bind(this);
    await Promise.all([
      this.fetchLanguages(),
      this.fetchCategories(),
      this.fetchAuthors(),
    ]);
  }

  async fetchLanguages(): Promise<void> {
    const availableLanguages = await this.languagesGQL.fetch().toPromise();
    const available = availableLanguages!.data.languages.map(({code, name}) => ({id: code, name}));
    this.initialLanguageState$.next({available, selected: []});
  }

  async fetchCategories(): Promise<void> {
    const categories = await this.categoriesGQL.fetch({input: {offset: 0, limit: 100}}).toPromise();
    const available = categories!.data.categories.map(({id, name}) => ({id: id.toString(), name}))
    this.initialCategoryState$.next({available, selected: []});
  }

  async fetchAuthors(): Promise<void> {
    const authors = await this.authorsGQL.fetch({input: {offset: 0, limit: 500}}).toPromise();
    const available = authors!.data.authors.map(({id, name}) => ({id: id.toString(), name}));
    this.initialAuthorState$.next({available, selected: []});
  }

  get lessons() {
    return this.createBookForm.controls.inventories as any;
  }

  addInventory(): void {
    const inventory = this.formBuilder.group({
      serialNumber: ['', Validators.required],
    });

    this.createBookForm.controls.inventories.push(inventory)
  }

  removeInventory(inventoryIndex: number): void {
    this.createBookForm.controls.inventories.removeAt(inventoryIndex);
  }

  updateFile(event: any) {
    // @ts-ignore
    this.file = (event?.target as HTMLInputElement)?.files[0];
    if (!this.file) {
      this.preview = undefined;
      return
    }
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(this.file)
  }


  async createBook() {
    const formValues = this.createBookForm.getRawValue()

    const variables: CreateBookMutationVariables = {
      input: {
        name: formValues.name!,
        description: formValues.description,
        preview: this.file,
        authorIds: this.selectedAuthors.map(a => +a.id),
        categoryIds: this.selectedCategories.map(c => +c.id),
        inventories: formValues.inventories as any,
        languages: this.selectedLangcodes.map(l => l.id),
      }
    };

    const res = await this.apollo.mutate<any>({
      mutation: this.createBookGQL.document,
      variables,
      context: {
        useMultipart: true
      }
    }).toPromise()
      .then(res => this.router.navigate(['']))
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
    await this.createAuthorGQL.mutate({input: {name}})
      .toPromise()
      .then(res => this.fetchAuthors())
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }

  async createCategory(name: string): Promise<void> {
    await this.createCategoryGQL.mutate({input: {name}})
      .toPromise()
      .then(res => this.fetchCategories())
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }
}
