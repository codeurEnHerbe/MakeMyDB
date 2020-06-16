import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MakeMyDB';

  public showLogin: boolean = true;

  constructor(
    public userService: UserService
    ) {
      this.userService.getIsUserConnected().subscribe( isUserConnected => this.showLogin = !isUserConnected)
     }
}
