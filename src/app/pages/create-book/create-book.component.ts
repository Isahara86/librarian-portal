import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AuthorsGQL,
  CategoriesGQL, CreateAuthorGQL,
  CreateBookGQL,
  CreateBookMutationVariables, CreateCategoryGQL,
  LanguagesGQL,
} from '../../@graphql/_generated';
import { Apollo } from 'apollo-angular';
import { MultiselectItem } from '../../components/multi-select/multi-select.component';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.scss']
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

  languageOptions$ = new BehaviorSubject<MultiselectItem[]>([]);
  selectedLangcodes: MultiselectItem[] = [];
  categoryOptions$ = new BehaviorSubject<MultiselectItem[]>([]);
  selectedCategories: MultiselectItem[] = [];
  authorOptions$ = new BehaviorSubject<MultiselectItem[]>([]);
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
    this.languageOptions$.next(availableLanguages!.data.languages.map(({code, name}) => ({id: code, name})));
  }

  async fetchCategories(): Promise<void> {
    const categories = await this.categoriesGQL.fetch({input: {offset: 0, limit: 100}}).toPromise();
    this.categoryOptions$.next(categories!.data.categories.map(({id, name}) => ({id: id.toString(), name})));
  }

  async fetchAuthors(): Promise<void> {
    const authors = await this.authorsGQL.fetch({input: {offset: 0, limit: 500}}).toPromise();
    this.authorOptions$.next(authors!.data.authors.map(({id, name}) => ({id: id.toString(), name})));
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
