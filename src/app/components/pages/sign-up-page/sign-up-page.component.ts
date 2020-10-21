import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROUTES } from 'src/app/misc/constants';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
})
export class SignUpPageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  signUpForm: FormGroup;
  showPassword: boolean;
  showPasswordConfirmation: boolean;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    if (userService.user) {
      userService.logout();
    }
  }

  private passwordWithConfirmationValidator = (control: AbstractControl) => {
    const password = control.get('password').value;
    const passwordConfirmation = control.get('passwordConfirmation').value;
    if (password !== passwordConfirmation) {
      return { differenceBetweenPasswordAndConfirmation: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      passwordWithConfirmation: this.formBuilder.group(
        {
          password: ['', [Validators.required, Validators.minLength(6)]],
          passwordConfirmation: [
            '',
            [Validators.required, Validators.minLength(6)],
          ],
        },
        { validators: [this.passwordWithConfirmationValidator] }
      ),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleShowPassword = () =>
    this.showPassword = !this.showPassword

  getPasswordInputType = () =>
    this.showPassword ? 'text' : 'password'

  toggleShowPasswordConfirmation = () =>
    this.showPasswordConfirmation = !this.showPasswordConfirmation

  getPasswordConfirmationInputType = () =>
    this.showPasswordConfirmation ? 'text' : 'password'

  areNameErrorsPresent = () =>
    !!this.signUpForm.get('name').errors

  areEmailErrorsPresent = () =>
    !!this.signUpForm.get('email').errors

  arePasswordErrorsPresent = () =>
    !!this.signUpForm.get('passwordWithConfirmation').get('password').errors

  arePasswordConfirmationErrorsPresent = () =>
    !!this.signUpForm
      .get('passwordWithConfirmation')
      .get('passwordConfirmation').errors

  arePasswordWithConfirmationErrorsPresent = () =>
    !!this.signUpForm.get('passwordWithConfirmation').errors

  isNameErrorPresent = (errorName: string) =>
    !!this.signUpForm.get('name').hasError(errorName)

  isEmailErrorPresent = (errorName: string) =>
    !!this.signUpForm.get('email').hasError(errorName)

  isPasswordErrorPresent = (errorName: string) =>
    !!this.signUpForm
      .get('passwordWithConfirmation')
      .get('password')
      .hasError(errorName)

  isPasswordConfirmationErrorPresent = (errorName: string) =>
    !!this.signUpForm
      .get('passwordWithConfirmation')
      .get('passwordConfirmation')
      .hasError(errorName)

  arePasswordAndConfirmationDifferent = () =>
    this.arePasswordWithConfirmationErrorsPresent() &&
    !!this.signUpForm
      .get('passwordWithConfirmation')
      .hasError('differenceBetweenPasswordAndConfirmation')

  onSubmit = () => {
    if (this.signUpForm.invalid) {
      return;
    }
    const {
      name,
      email,
      passwordWithConfirmation,
    } = this.signUpForm.controls;
    const {
      password,
      passwordConfirmation,
    } = (passwordWithConfirmation as FormGroup).controls;
    this.subscriptions.push(
      this.userService
        .signUp({
          name: name.value,
          email: email.value,
          password: password.value,
          password_confirmation: passwordConfirmation.value,
        })
        .subscribe((_) => this.router.navigate([`/${ROUTES.DEFAULT}`]))
    );
  }
}
