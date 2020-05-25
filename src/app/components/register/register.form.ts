import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';

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
        console.log(this.confirmPassword.errors)
        if (control.value.length) {
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
        if (control.value.length) {
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

    private checkPasswords(control: AbstractControl) {
        let pass = control.parent.controls['password'].value;
        let confirmPass = control.value;
        return pass === confirmPass ? null : { notSame: true }
    }

    private addValidators() {
        this.userName.setValidators(Validators.required);
        this.email.setValidators(Validators.compose([Validators.required, Validators.email]));
        this.password.setValidators(Validators.compose([Validators.required, Validators.minLength(6)]));
        this.confirmPassword.setValidators(Validators.compose([Validators.required, this.checkPasswords]));
        this.userName.setAsyncValidators(this.validateUserNameNotTaken.bind(this));
        this.email.setAsyncValidators(this.validateEmailNameNotTaken.bind(this));
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