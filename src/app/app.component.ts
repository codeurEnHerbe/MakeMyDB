import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MakeMyDB';

  public showLogin: boolean = true;

  constructor(
    public userService: UserService,
    public cookieService: CookieService
  ) {
    this.showLogin = sessionStorage.getItem("isUserConnected") == 'false' || !sessionStorage.getItem("isUserConnected");
    this.userService.getIsUserConnected().subscribe(isUserConnected => { this.showLogin = !isUserConnected; })
  }

  deleteCookie() {
    this.userService.logout();
  }
}
