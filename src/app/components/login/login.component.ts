import { Component, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

  public loginStatus; 
  public username: string;
  public password: string;

  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router
    ) { }

  login(){
    if(this.username && this.password){
      this.userService.login(this.username, this.password).subscribe(
        (res) => {
          this.userService.isUserConnected.next(true);
          sessionStorage.setItem("isUserConnected", "true");
          this.router.navigate(['editor'])
        },(error) => {
          this.loginStatus = "Wrong username or password"
        }
      );
    }else{
      this.loginStatus = "Please fill the missing fields"
    }
  }

}
