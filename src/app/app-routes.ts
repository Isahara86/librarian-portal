import { Routes } from '@angular/router';
import { AdminAuthGuard } from './services/admin-auth-guard.service';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/books-list.component').then(m => m.BooksListComponent),
    //   loadChildren: () => import("./app/layout/layout.routes").then((m) => m.routes),
  },

  {
    path: 'customers-list',
    loadComponent: () =>
      import('./pages/customers-list.component').then(m => m.CustomersListComponent),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'create-customer',
    loadComponent: () =>
      import('./pages/create-update-customer.component').then(m => m.CreateUpdateCustomerComponent),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'update-customer/:customerId',
    loadComponent: () =>
      import('./pages/create-update-customer.component').then(m => m.CreateUpdateCustomerComponent),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'create-author',
    loadComponent: () =>
      import('./pages/create-author.component').then(m => m.CreateAuthorComponent),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'create-book',
    loadComponent: () =>
      import('./pages/create-update-book.component').then(m => m.CreateUpdateBookComponent),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'update-book/:bookId',
    loadComponent: () =>
      import('./pages/create-update-book.component').then(m => m.CreateUpdateBookComponent),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'create-category',
    loadComponent: () =>
      import('./pages/create-category.component').then(m => m.CreateCategoryComponent),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'invite-admin',
    loadComponent: () => import('./pages/invite-admin.component').then(m => m.InviteAdminComponent),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent),
  },

  { path: '**', redirectTo: '' },
];
