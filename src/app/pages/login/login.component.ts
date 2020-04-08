import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
//import { SharedLoginService } from '../../services/sharedLogin.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';


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
  dialogResponse: any;
}
export interface ResetPassword{
  otp: string,
  phone: string,
  password: string
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
    phone: 'string',
    password: 'string'
  };
  dialogRef:MatDialogRef<ForgotPasswordDialog>;
  otpDialogRef:MatDialogRef<OTPComponent>;
  updateDialogRef:MatDialogRef<UpdatePasswordComponent>;
  dialogResponse:any;
  otpResponse:any;


  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
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
  openDialog(): void{
    this.dialogRef = this.dialog.open(ForgotPasswordDialog, {
      width: '700px',height: '200px',
      data: {dialogResponse:this.dialogResponse}
    });
    const sub=this.dialogRef.componentInstance.onSubmit.subscribe((data) => {
      this.dialogResponse=data;
      console.log(this.dialogResponse);
      if(this.dialogResponse.message=="otp sent"){
        this.otpDialogRef=this.dialog.open(OTPComponent,{
          width: '500px',height: '200px',
          data:{dialogResponse: this.dialogResponse}
        });
        const sendOTP=this.otpDialogRef.componentInstance.onSendOTP.subscribe((data)=>{
          this.otpResponse=data;
          console.log(this.otpResponse);
          if(this.otpResponse.verified==true){
            this.updateDialogRef=this.dialog.open(UpdatePasswordComponent,{
              width: '500px',height: '500px'
            });
          }
        });
        this.otpDialogRef.afterClosed().subscribe(result => {
          this.resetPassword.otp=result;
          console.log(this.resetPassword);
        });
      }
    })
    this.dialogRef.afterClosed().subscribe(name => {
      this.resetPassword.phone=name;
      console.log(this.resetPassword);
    });
    
    
  }

}

//ForgotPasswordComponent
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
  otpDialogRef: MatDialogRef<OTPComponent>

  onSubmit= new EventEmitter();

  onClick(){
  }
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ForgotPasswordDialog>,
    public otpDialog: MatDialogRef<OTPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
    this.form = this.formBuilder.group({
      phone: ''
    });  
  }
  submit(form){
    this.dialogRef.close(`${form.value.phone}`);
    const data = Object.assign({},this.resetMethod ,this.form.value);
    console.log(data);
    this.authService.forgotPassword(data,'').subscribe(
      response=>{
        this.res=response.body;
        this.onSubmit.emit(this.res);
        console.log(response.body);
      },
      error=>{
        console.log(error);
      }
    );    
  }
}

//OTPComponent
@Component({
  selector: 'app-otp',
  templateUrl : './otp.component.html',
  styleUrls: ['./otp.component.scss']
})

export class OTPComponent implements OnInit{
  form: FormGroup;
  otp: string;
  userId: string;
  res:any;

  onSendOTP= new EventEmitter();

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OTPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ){}

  ngOnInit(){
    this.form=this.formBuilder.group({
      otp: ''
    })
    console.log(this.data);
    this.userId=this.data.dialogResponse.user_id;
    console.log(this.userId);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(form){
    this.dialogRef.close(`${form.value.otp}`);
    const data = Object.assign({},this.form.value);
    this.authService.sendOTP(data,'?id='+this.userId).subscribe(
      response=>{
        this.res=response.body;
        console.log(response);
        
        this.onSendOTP.emit(this.res);return;
      },
      error=>{
        console.log(error);
      }
    );
  }
}

//UpdatePasswordComponent
@Component({
  selector: 'app-update-password',
  templateUrl : './updatePassword.component.html',
  styleUrls: ['./updatePassword.component.scss']
})

export class UpdatePasswordComponent implements OnInit{
  pass:string;
  form:FormGroup;

  constructor(    
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ){}
  
  ngOnInit(){
    this.form=this.formBuilder.group({
      pass: ['',[Validators.required,Validators.minLength(8)]],
      confirmPass: ['',[Validators.required,Validators.minLength(8)]]
    },{validator:this.checkPasswordValidity});
  }

  checkPasswordValidity(p: FormGroup){
    return p.get('password').value === p.get('passwordConfirm').value
       ? null : {'mismatch': true};
  }

  submit(form){
    this.dialogRef.close(`${form.value.pass}`);
  }
}