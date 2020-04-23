import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { InputValidationUsername } from '../../utils/enums/input.enum';
import { IInputInfos } from '../../interfaces/inputs.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private inputIsValid = {
    username: InputValidationUsername.OK,
    email: false,
    password: false,
    passwordConfirm: false,
  }

  public inputs: Array<IInputInfos> = [
    {
      name: "Username",
      value: "username",
      type: "text",
      error: {
        inputValidationStatus: this.inputIsValid.username === 1,
        errorMessage: "This username is already taken"
      }
    },
    {
      name: "Password",
      value: "password",
      type: "password"
    },
    {
      name: "Confirm Password",
      value: "passwordConfirm",
      type: "password"
    }
  ]
  public username: string = "";
  public password: string = "";
  public passwordConfirm: string = "";


  constructor(private userService:UserService) { 
  }

  ngOnInit() {
  }

  register(){
    this.checkInputs();
  }

  private checkInputs() {
    if(!this.username){
      this.userService.checkUserName(this.username).subscribe(isValid => {
        isValid ? this.inputIsValid.username = InputValidationUsername.OK : this.inputIsValid.username = InputValidationUsername.TAKEN;
        console.log(this.inputIsValid.username);
      })
    }
  }
}
