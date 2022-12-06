import { Component } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GraphQlService } from './@graphql/graphql.service';
import { addWarning } from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { createApolloWithToken } from './@graphql/graphql.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public message: string = 'Hello!';

  constructor(private readonly graphQlService: GraphQlService, private apollo: Apollo, private readonly httpLink: HttpLink) {
    console.log(111);
  }

  async fetchMenu(): Promise<void> {
    console.log(await this.graphQlService.findBooks().toPromise())
  }

  async resetToken(): Promise<void> {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmlrdG9yIiwic3ViIjozLCJpYXQiOjE2NzAzNTU5NTl9.6oD96n_chefco0l9RXQvfYx1_PJxDgIlG4zT-tNJpBA";
    // this.apollo.client.setLink(buildApolloLink(token, this.httpLink))

    await this.apollo.removeClient();
    await this.apollo.create(createApolloWithToken(this.httpLink, token));
  }
}
