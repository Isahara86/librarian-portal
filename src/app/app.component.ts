import { Component } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GraphQlService } from './@graphql/graphql.service';
import { addWarning } from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { createApolloWithToken } from './@graphql/graphql.module';
import { FormBuilder } from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-root',
  // templateUrl: './app.component.html',
  template: `
    <div>Main</div>
    <button (click)="fetchBooks()">Try Me</button>

    <!--<button (click)="resetToken()">Reset Apollo Token</button>-->


    <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">

      <div>
        <label for="login">
          Name
        </label>
        <input id="login" type="text" formControlName="login">
      </div>

      <div>
        <label for="password">
          Address
        </label>
        <input id="password" type="text" formControlName="password">
      </div>

      <button class="button" type="submit">Purchase</button>

    </form>`,
  styles: [`table {
    width: 100%;
  }`],
})
export class AppComponent {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;


  public message: string = 'Hello!';
  checkoutForm = this.formBuilder.group({
    login: '',
    password: ''
  });

  constructor(
    private readonly graphQlService: GraphQlService,
    private apollo: Apollo,
    private readonly httpLink: HttpLink,
    private formBuilder: FormBuilder,
  ) {
    setInterval(() => {
      this.dataSource[0].weight++;
      this.dataSource[5].position++;
    }, 1000)
  }

  async onSubmit(): Promise<void> {
    console.log(this.checkoutForm.getRawValue());
    this.graphQlService.adminLogin({input: this.checkoutForm.getRawValue() as any});
  }

  async fetchBooks(): Promise<void> {
    console.log(await this.graphQlService.findBooks().toPromise())
  }
}
