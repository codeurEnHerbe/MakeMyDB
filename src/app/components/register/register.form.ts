import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

export class RegisterForm extends FormGroup {
    constructor(private userService: UserService) {
        super({
            userName: new FormControl(""),
            email: new FormControl(""),
            password: new FormControl(""),
            confirmPassword: new FormControl("")
        });
        this.addValidators()
    }

    private validateUserNameNotTaken(control: AbstractControl) {
        if (control.value.length){
            return this.userService.checkUserName(control.value).pipe( 
                map(
                    res => {
                        return res ? { usernameTaken: true } : null;
                    }
                )
            );
        }
        return false;
    }

    private validateEmailNameNotTaken(control: AbstractControl) {
        if (control.value.length){
            return this.userService.checkEmail(control.value).pipe( 
                map(
                    res => {
                        return !res ? { emailTaken: true } : null;
                    }
                )
            );
        }
        return false;
    }

    private validateEmailSyntaxConform(control: AbstractControl) {
        if (control.value.length){
            var pattern = /\S+@\S+\.\S+/;
            return control.value.match(pattern) ? of(true) : of(false)
        }
        return false;
    }

    private addValidators() {
          this.userName.setValidators(Validators.required);
          this.email.setValidators(Validators.required);
          this.userName.setAsyncValidators([this.validateUserNameNotTaken.bind(this)]);
          this.email.setAsyncValidators( Validators.composeAsync(
            [this.validateEmailNameNotTaken.bind(this), this.validateEmailSyntaxConform.bind(this)]));
    }

    get userName() {
        return this.get('userName') as FormControl;
    }
    get email() {
        return this.get('email') as FormControl;
    }
    get password() {
        return this.get('password') as FormControl;
    }
    get confirmPassword() {
        return this.get('confirmPassword') as FormControl;
    }
}