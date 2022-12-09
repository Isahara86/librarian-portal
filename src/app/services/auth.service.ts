import { Injectable } from '@angular/core';
import { createApolloWithToken } from '../@graphql/graphql.module';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { AdminLoginGQL } from '../@graphql/_generated';
import { HttpLink } from 'apollo-angular/http';

export const ADMIN_STORAGE_KEY = 'admin_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly admin$: BehaviorSubject<{ readonly name: string, readonly token: string } | null>;

  constructor(
    private apollo: Apollo,
    private adminLoginGQL: AdminLoginGQL,
    private httpLink: HttpLink,
  ) {
    const adminStr = localStorage.getItem(ADMIN_STORAGE_KEY);
    let admin: { readonly name: string, readonly token: string } | null = null;
    try {
      if (adminStr) {
        admin = JSON.parse(adminStr);
      }
    } catch (e) {
    }
    this.admin$ = new BehaviorSubject<{ readonly name: string, readonly token: string } | null>(admin)

    if (admin?.token) {
      this.rebuildApollo(admin.token);
    }
  }

  private async rebuildApollo(token?: string): Promise<void> {
    await this.apollo.removeClient();
    await this.apollo.create(createApolloWithToken(this.httpLink, token));
  }

  public get currentUserValue() {
    return this.admin$.value;
  }

  async adminLogin(login: string, password: string): Promise<void> {
    const res = await this.adminLoginGQL.mutate({input: {login, password}}).toPromise();

    const admin = res?.data?.adminLogin
    if (!admin) {
      throw (res?.errors || new Error('Unable to authenticate'));
    }

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
    this.admin$.next(admin);
    await this.rebuildApollo(admin.token)
  }

  async adminLogout() {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    this.apollo.removeClient();
    await this.rebuildApollo();
    this.admin$.next(null);
  }
}
