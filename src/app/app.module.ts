import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './@graphql/graphql.module';
import { MatTableModule } from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { BooksListComponent } from './pages/books-list/books-list.component';
import { CreateBookComponent } from './pages/create-book/create-book.component';
import { LoginComponent } from './pages/login/login.component';

// import { MatListModule } from '@angular/material/list';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AppComponent, BooksListComponent, CreateBookComponent, LoginComponent],
  imports: [
    BrowserModule,
    FormsModule,
    // AppRoutingModule,
    GraphQLModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTableModule,
    // MatListModule,
    // MatInputModule,
    // MatButtonModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
