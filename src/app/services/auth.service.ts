import { Injectable } from '@angular/core';
import { buildApolloConfig } from '../@graphql/graphql.module';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AdminLoginGQL } from '../@graphql/_generated';
import { HttpLink } from 'apollo-angular/http';
import { DialogService } from './dialog.service';
import { Router } from '@angular/router';

export const ADMIN_STORAGE_KEY = 'admin_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly admin$: BehaviorSubject<{ readonly name: string; readonly token: string } | null>;

  constructor(
    private apollo: Apollo,
    private adminLoginGQL: AdminLoginGQL,
    private httpLink: HttpLink,
    private dialogService: DialogService,
    private router: Router,
  ) {
    const adminStr = localStorage.getItem(ADMIN_STORAGE_KEY);
    let admin: { readonly name: string; readonly token: string } | null = null;
    try {
      if (adminStr) {
        admin = JSON.parse(adminStr);
      }
    } catch (e) {
      /* empty */
    }
    this.admin$ = new BehaviorSubject<{ readonly name: string; readonly token: string } | null>(
      admin,
    );

    if (admin?.token) {
      this.rebuildApollo();
    }
  }

  private rebuildApollo(): void {
    const adminToken = this.admin$.getValue()?.token;
    this.apollo.removeClient();
    this.apollo.create(buildApolloConfig(this.httpLink, adminToken));
  }

  async adminLogin(login: string, password: string): Promise<void> {
    const res = await this.dialogService.showLoadingUntil(
      this.adminLoginGQL.mutate({ input: { login, password } }),
    );
    // const res = await firstValueFrom(this.adminLoginGQL.mutate({ input: { login, password } }));

    const admin = res?.data?.adminLogin;
    if (!admin) {
      throw res?.errors || new Error('Unable to authenticate');
    }

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
    this.admin$.next(admin);
    await this.rebuildApollo();
  }

  adminLogout(): void {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    this.admin$.next(null);
    this.rebuildApollo();
    this.router.navigate(['/']);
  }
}
