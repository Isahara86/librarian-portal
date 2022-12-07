import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdminLoginGQL, CreateBookGQL, CreateBookMutationVariables } from '../../@graphql/_generated';
import { addWarning } from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.scss']
})
export class CreateBookComponent {

  createBookForm = this.formBuilder.group({
    name: '',
    description: '',
  });

  file?: File;
  preview?: string;

  constructor(
    private formBuilder: FormBuilder,
    private createBookGQL: CreateBookGQL,
    private apollo: Apollo,
  ) {
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
     }
   };

   const res = await this.apollo.mutate<any>({
     mutation: this.createBookGQL.document,
     variables,
     context: {
       useMultipart: true
     }
   }).toPromise();

   // TODO find solution
   console.log(res);

    await this.createBookGQL.mutate({
      input: {
        name: formValues.name!,
        description: formValues.description,
        preview: this.file,
        authorIds: [],
        categoryIds: [],
        inventories: [],
      }
    }, ).toPromise();
  }

}
