import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  appVersion = packageJson.version;
  constructor(public readonly auth: AuthService) {}
}
