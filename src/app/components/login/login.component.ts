import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CookieService } from 'ngx-cookie-service';

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
    private cookieService: CookieService
    ) { }

  login(){
    if(this.username && this.password){
      this.userService.login(this.username, this.password).subscribe(
        (res) => console.log(console.log(res))
      );
    }else{
      this.loginStatus = "Please fill the missing fields"
    }
  }

  me(){ 
    this.userService.userInfos().subscribe(res => console.log(res));
  }
}
