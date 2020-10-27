import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROUTES } from 'src/app/misc/constants';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private returnUrl: string;
  signInForm: FormGroup;
  showPassword: boolean;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (userService.user) {
      router.navigate([`/${ROUTES.DEFAULT}`]);
    }
  }

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.returnUrl = (
      this.route.snapshot.queryParams.return_url ||
      `/${ROUTES.DEFAULT}`
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleShowPassword = () =>
    this.showPassword = !this.showPassword

  getPasswordInputType = () =>
    this.showPassword ? 'text' : 'password'

  isFieldErrorPresent = (fieldName: string, errorName: string) =>
    !!this.signInForm.get(fieldName).hasError(errorName)

  onSubmit = () => {
    if (this.signInForm.invalid) {
      return;
    }
    const { email, password } = this.signInForm.controls;
    this.subscriptions.push(
      this.userService
        .signIn({ email: email.value, password: password.value })
        .subscribe((_) => this.router.navigate([this.returnUrl]))
    );
  }
}
