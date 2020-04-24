import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { RegisterForm } from './register.form';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: RegisterForm;

  constructor(private userService: UserService) {
    this.registerForm = new RegisterForm(userService);
  }

  ngOnInit() {
  }

  register() {
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value);
    }
  }
}
