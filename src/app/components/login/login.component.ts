import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

  public loginStatus; 
  public username: string;
  public password: string;

  constructor(private userService: UserService) { }

  login(){
    if(this.username && this.password){
      console.log(this.userService.login(this.username, this.password).subscribe())
    }else{
      this.loginStatus = "Please fill the missing fields"
    }
  }
}
