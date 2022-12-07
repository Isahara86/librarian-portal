import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksListComponent } from './pages/books-list/books-list.component';
import { CreateBookComponent } from './pages/create-book/create-book.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: 'books', component: BooksListComponent },
  { path: 'create-book', component: CreateBookComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
