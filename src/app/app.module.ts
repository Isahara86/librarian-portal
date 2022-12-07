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
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';

// import { MatListModule } from '@angular/material/list';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AppComponent, BooksListComponent, CreateBookComponent, LoginComponent, MultiSelectComponent],
  imports: [
    BrowserModule,
    FormsModule,
    GraphQLModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTableModule,
    AppRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
