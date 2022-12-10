import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksListComponent } from './pages/books-list/books-list.component';
import { CreateBookComponent } from './pages/create-book/create-book.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { CreateAuthorComponent } from './pages/create-author/create-author.component';
import { CreateCategoryComponent } from './pages/create-category/create-category.component';
import { InviteAdminComponent } from './pages/invite-admin/invite-admin.component';

const routes: Routes = [
  {path: '', component: BooksListComponent},
  {path: 'create-book', component: CreateBookComponent, canActivate: [AdminAuthGuard]},
  {path: 'create-author', component: CreateAuthorComponent, canActivate: [AdminAuthGuard]},
  {path: 'create-category', component: CreateCategoryComponent, canActivate: [AdminAuthGuard]},
  {path: 'invite-admin', component: InviteAdminComponent, canActivate: [AdminAuthGuard]},
  {path: 'login', component: LoginComponent},

  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
