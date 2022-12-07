import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  CreateBookGQL,
  CreateBookMutationVariables,
  LanguagesGQL,
} from '../../@graphql/_generated';
import { Apollo } from 'apollo-angular';
import { MultiselectItem } from '../../components/multi-select/multi-select.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.scss']
})
export class CreateBookComponent implements OnInit {

  createBookForm = this.formBuilder.group({
    name: '',
    description: '',
  });

  languagesInputOptions$ = new BehaviorSubject<MultiselectItem[]>([]);

  file?: File;
  preview?: string;

  constructor(
    private formBuilder: FormBuilder,
    private createBookGQL: CreateBookGQL,
    private languagesGQL: LanguagesGQL,
    private apollo: Apollo,
  ) {
  }

  async ngOnInit(): Promise<void> {
    const availableLanguages = await this.languagesGQL.fetch().toPromise();
    this.languagesInputOptions$.next(availableLanguages!.data.languages.map(({code, name})=>({id: code, name})));
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
    console.log(this.createBookForm.getRawValue());
    console.log(this.file);
    const formValues = this.createBookForm.getRawValue()

    const variables: CreateBookMutationVariables = {
      input: {
        name: formValues.name!,
        description: formValues.description,
        preview: this.file,
        authorIds: [],
        categoryIds: [],
        inventories: [],
        languages: [],
      }
    };

    const res = await this.apollo.mutate<any>({
      mutation: this.createBookGQL.document,
      variables,
      context: {
        useMultipart: true
      }
    }).toPromise();

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

}
