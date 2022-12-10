import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, Route } from "@angular/router";
import { AppComponent } from "./app/app.component";
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { GraphQLModule } from './app/@graphql/graphql.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutes } from './app/app-routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(GraphQLModule),
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(appRoutes),
  ]
}).catch((err) =>
  console.log(err)
);
