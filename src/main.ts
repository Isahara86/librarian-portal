import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { GraphQLModule } from './app/@graphql/graphql.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutes } from './app/app-routes';
import { MatDialogModule } from '@angular/material/dialog';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // for graphql server requests
    importProvidersFrom(GraphQLModule),
    importProvidersFrom(BrowserAnimationsModule),
    // for dialog global available
    importProvidersFrom(MatDialogModule),
    provideRouter(appRoutes),
  ],
}).catch(err => console.log(err));
