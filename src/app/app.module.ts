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
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { CreateAuthorComponent } from './pages/create-author/create-author.component';
import { CreateCategoryComponent } from './pages/create-category/create-category.component';

// import { MatListModule } from '@angular/material/list';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    CreateBookComponent,
    LoginComponent,
    MultiSelectComponent,
    CreateAuthorComponent,
    CreateCategoryComponent,
  ],
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
    MatIconModule,
  ],
  providers: [
    AuthService,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
