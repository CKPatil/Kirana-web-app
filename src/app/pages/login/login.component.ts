import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  role: string;
  verificationData: any;
  isLogin: boolean;
  errorMessage: string;
  loginForm: any;
  isRegister = false;
  btnInfo = 'Register if first time login';
  registerBtn = 'Register';
  loginBtn = 'Sign in';
  hide = true;
  static confirmPassword: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
    // protected commonUtil: CommonUtil
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required,
        Validators.email]],
      // password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')]],
      password: ['', []],
    });
  }

  ngOnInit() {
    this.role = localStorage.getItem('userType');
    this.redirectToTeam();
    this.verificationData = this.authService.getLoginData();
    if (this.verificationData) {
      this.loginForm.patchValue({
        emailId: this.verificationData.emailId
      });
      localStorage.setItem('token', this.verificationData.jwtToken);
      this.role = this.verificationData.companyType;
    }
    if (!this.role) {
      this.existingLogin();
    }
  }

  public existingLogin() {
    this.isLogin = this.isLogin ? false : true;
    // this.loginForm.controls.emailId.setValue(null);
    // this.loginForm.controls.password.setValue(null);
  }

  public login() {
    if (this.loginBtn === 'Sign in') {
      const data = Object.assign({}, this.loginForm.value);
      this.authService.login(data).subscribe(
        response => {
          console.log(response.body);
          localStorage.setItem('userId', response.body['userId']);
          localStorage.setItem('userType', response.body['userType']);
          localStorage.setItem('emailId', response.body['emailId']);
          localStorage.setItem('refresh', response.body['refresh']);
          localStorage.setItem('access', response.body['access']);
          localStorage.setItem('user', JSON.stringify(response.body));
          this.role = localStorage.getItem('userType');
          this.redirectToTeam();
        },
        error => {
          this.errorMessage = 'Please enter valid credentials';
          // this.commonUtil.openErrorSnackBar(this.errorMessage);
        }
      );
    } else {
      this.signUp();
    }
  }

  public registerClicked() {
    this.loginForm.patchValue({
      username: '',
      password: ''
    });
    this.isRegister = this.isRegister ? false : true;
    this.btnInfo = this.btnInfo === 'Register if first time login' ? 'Sign In if already a user' : 'Register if first time login';
    this.registerBtn = this.registerBtn === 'Register' ? 'Sign In' : 'Register';
    this.loginBtn = this.loginBtn === 'Sign in' ? 'Sign up' : 'Sign in';
  }

  public signUp() {
    // this.loginForm.controls.companyType.setValue(this.role);
    const data = Object.assign({}, this.loginForm.value);
    this.authService.signUp(data).subscribe(
      response => {
        const message = response.body['message'] + ', Please login now';
        // this.commonUtil.openSnackBar(message);
        this.loginForm.controls.emailId.setValue(null);
        this.loginForm.controls.password.setValue(null);
        this.existingLogin();
        localStorage.setItem(
          'cpw',
          this.loginForm.controls.confirmPassword.value
        );
      },
      error => {
        if (error.status === 403) {
          // this.commonUtil.openErrorSnackBar(
          //   'Invitation link expired, please contact admin'
          // );
        } else if (error.error && error.error.message) {
          // this.commonUtil.openErrorSnackBar(error.error.message);
        } else {
          // this.commonUtil.openErrorSnackBar('Error');
        }
      }
    );
  }

  redirectToTeam() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
