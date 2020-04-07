import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormBuilder,
  FormGroup,

} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
//import { SharedLoginService } from '../../services/sharedLogin.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EventEmitter } from 'protractor';


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
export interface DialogData {
  emailID: string;
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
  phoneNumber: string;
  resetPassword={
    otp: 'string',
    phoneNumber: 'string',
    newPassword: 'string'
  };
  dialogRef:MatDialogRef<ForgotPasswordDialog>;
  dialogResponse:any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    //private sharedService: SharedLoginService
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


  // recieveResponse($event){
  //   this.dialogResponse=$event;
  //   console.log(this.dialogResponse);
    
  // }

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
  openDialog(): void{
    this.dialogRef = this.dialog.open(ForgotPasswordDialog, {
      width: '700px',height: '200px'
    });

    this.dialogRef.afterClosed().subscribe(name => {
      console.log(name);
      this.phoneNumber=name;
      this.resetPassword.phoneNumber=this.phoneNumber;
      console.log(this.resetPassword);      
      console.log(this.phoneNumber);
    })
  }
}

@Component({
  selector: 'app-forgot-password',
  templateUrl : './forgotPasswordDialog.component.html',
  styleUrls: ['./forgotPasswordDialog.component.scss']
})

// tslint:disable-next-line: component-class-suffix
export class ForgotPasswordDialog implements OnInit{
  form: FormGroup;
  resetMethod={
    reset_method:"mobile"
  }
  res:any;

  //@Output() responseEvent =new EventEmitter();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ForgotPasswordDialog>,
    //private sharedservice: SharedLoginService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      //this.sharedservice.response="";
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
    this.form = this.formBuilder.group({
      phone: ''
    })
    
  }

  // ngAfterContentChecked(){
  //   this.res=this.sharedservice.response;
  // }

  // updateResponse(obj){
  //   this.sharedservice.updateResponse(obj);
  // }
  
  // sendResponse(){
  //   this.responseEvent.emit(this.response);
  // }

  submit(form){
    this.dialogRef.close(`${form.value.phone}`);
    const data = Object.assign({},this.resetMethod ,this.form.value);
    console.log(data);
    this.authService.forgotPassword(data).subscribe(
      response=>{
        this.res=response.body;
        //this.updateResponse(this.res);
        console.log(this.res);
      },
      error=>{
        console.log(error);
      }
    );
  }
}
