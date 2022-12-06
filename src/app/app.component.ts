import { Component } from '@angular/core';
import { Guid } from 'guid-typescript';
import { GraphQlService } from './@graphql/graphql.service';
import { addWarning } from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public message: string = 'Hello!';

  constructor(private readonly graphQlService: GraphQlService) {
    console.log(111);
  }

  async fetchMenu(): Promise<void> {
    console.log(await this.graphQlService.findBooks().toPromise())
  }
}
