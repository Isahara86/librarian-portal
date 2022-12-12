import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import packageJson from '../../package.json';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    AsyncPipe,
    NgIf,
  ],
  template: `
    <div style="width: 100vw; height: 100vh; max-height: 100vh; max-width: 100vw; overflow:scroll;">
      <div style="position: relative; display: flex; flex-direction: column; min-height: 100vh;">
        <mat-toolbar color="primary">
          <button
            mat-icon-button
            class="example-icon"
            aria-label="Example icon-button with menu icon"
            [matMenuTriggerFor]="menu"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <mat-menu #menu="matMenu">
            <a mat-menu-item routerLink="" routerLinkActive="active">Books</a>
            <a
              *ngIf="auth.admin$ | async"
              mat-menu-item
              routerLink="/create-book"
              routerLinkActive="active"
              >Create Book</a
            >
            <a
              *ngIf="auth.admin$ | async"
              mat-menu-item
              routerLink="/create-author"
              routerLinkActive="active"
              >Create Author</a
            >
            <a
              *ngIf="auth.admin$ | async"
              mat-menu-item
              routerLink="/create-category"
              routerLinkActive="active"
              class="mat-primary"
              >Create Category</a
            >
            <a
              *ngIf="auth.admin$ | async"
              mat-menu-item
              routerLink="/invite-admin"
              routerLinkActive="active"
              >Invite librarian</a
            >
            <a
              *ngIf="(auth.admin$ | async) !== null"
              mat-menu-item
              routerLink="/login"
              routerLinkActive="active"
              >Login</a
            >
            <button *ngIf="auth.admin$ | async" mat-menu-item (click)="auth.adminLogout()">
              Logout
            </button>
          </mat-menu>

          <span>Library</span>
          <span class="example-spacer"></span>
          <!--        <span *ngIf="(auth.admin$ | async)?.name">Hello {{(auth.admin$ | async)?.name}}</span>-->
          <!--        <a *ngIf="!(auth.admin$ | async)" routerLink="/login"><mat-error>Please login</mat-error></a>-->
        </mat-toolbar>

        <!--         The routed views render in the <router-outlet>-->
        <div style="overflow-x: scroll">
          <router-outlet></router-outlet>
        </div>

        <p style="position: absolute; bottom: 0; right: 0;">
          <span style="padding-right: 20px">{{ appVersion }}</span>
        </p>
      </div>
    </div>
  `,
})
export class AppComponent {
  appVersion = packageJson.version;

  constructor(public readonly auth: AuthService) {}
}
