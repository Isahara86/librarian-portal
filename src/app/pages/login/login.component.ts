import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdminLoginGQL, AdminLoginMutationVariables } from '../../@graphql/_generated';
import { createApolloWithToken } from '../../@graphql/graphql.module';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    login: '',
    password: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private adminLoginGQL: AdminLoginGQL,
    private apollo: Apollo,
    private httpLink: HttpLink,
  ) {
  }

  public async adminLogin() {
    const values = this.loginForm.getRawValue();
    const res = await this.adminLoginGQL.mutate({input: values as any}).toPromise();

    const token = res?.data?.adminLogin.token;
    if (!token) {
      throw new Error();
    }

    await this.apollo.removeClient();
    await this.apollo.create(createApolloWithToken(this.httpLink, token));
  }

}
