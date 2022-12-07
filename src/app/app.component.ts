import { Component } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GraphQlService } from './@graphql/graphql.service';
import { addWarning } from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { createApolloWithToken } from './@graphql/graphql.module';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {}
