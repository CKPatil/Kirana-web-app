import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Component, OnInit, Inject } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ErrorStateMatcher } from "@angular/material/core";
import { Router } from "@angular/router";
import { OldPwdValidators } from "./olPwdvalidator.component";
import { MatSnackBar } from "@angular/material";
import { timer, Subscription } from "rxjs";

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
export interface ResetPassword {
  otp: string;
  phone: string;
  password: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  role: string;
  verificationData: any;
  isLogin: boolean;
  errorMessage: string;
  loginForm: any;
  isRegister = false;
  btnInfo = "Register if first time login";
  registerBtn = "Register";
  loginBtn = "Sign in";
  hide = true;
  phoneNumber: string;
  dialogRef: MatDialogRef<ForgotPasswordDialog>;
  otpDialogRef: MatDialogRef<OTPComponent>;
  updateDialogRef: MatDialogRef<UpdatePasswordComponent>;
  dialogResponse: any;
  otpResponse: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: [
        "",
        [
          Validators.required,
        ],
      ],
    });
  }

  ngOnInit() {
    this.role = localStorage.getItem("userType");
    this.redirectToTeam();
    this.verificationData = this.authService.getLoginData();
    if (this.verificationData) {
      this.loginForm.patchValue({
        emailId: this.verificationData.emailId,
      });
      localStorage.setItem("token", this.verificationData.jwtToken);
      this.role = this.verificationData.companyType;
    }
    if (!this.role) {
      this.existingLogin();
    }
    localStorage.setItem('inviteStatus', 'true');
    localStorage.setItem('newOrder', 'true');
    localStorage.setItem('cancelOrder', 'true');
    localStorage.setItem('criticalOrder', 'true');
    localStorage.setItem('packedOrder', 'true');
    localStorage.setItem('dispatchedOrder', 'true');
  }

  public existingLogin() {
    this.isLogin = this.isLogin ? false : true;
  }

  togglePasswordView(e) {
    if (!e.target.matches('button')) {
      this.hide = !this.hide;
    }
  }

  public login() {
    if (this.loginBtn === "Sign in") {
      const data = Object.assign({}, this.loginForm.value);
      this.authService.login(data).subscribe(
        (response) => {
          localStorage.setItem("userId", response.body["userId"]);
          localStorage.setItem("userType", response.body["userType"]);
          localStorage.setItem("emailId", response.body["emailId"]);
          localStorage.setItem("refresh", response.body["refresh"]);
          localStorage.setItem("access", response.body["access"]);
          localStorage.setItem("user", JSON.stringify(response.body));
          this.role = localStorage.getItem("userType");
          this.redirectToTeam();
        },
        (error) => {
          this.errorMessage = "Please enter valid credentials";
          this._snackbar.open(this.errorMessage, "", {
            duration: 5000,
          });
        }
      );
    } else {
      this.signUp();
    }
  }

  public registerClicked() {
    this.loginForm.patchValue({
      username: "",
      password: "",
    });
    this.isRegister = this.isRegister ? false : true;
    this.btnInfo =
      this.btnInfo === "Register if first time login"
        ? "Sign In if already a user"
        : "Register if first time login";
    this.registerBtn = this.registerBtn === "Register" ? "Sign In" : "Register";
    this.loginBtn = this.loginBtn === "Sign in" ? "Sign up" : "Sign in";
  }

  public signUp() {
    const data = Object.assign({}, this.loginForm.value);
    this.authService.signUp(data).subscribe(
      (response) => {
        const message = response.body["message"] + ", Please login now";
        this.loginForm.controls.emailId.setValue(null);
        this.loginForm.controls.password.setValue(null);
        this.existingLogin();
        localStorage.setItem(
          "cpw",
          this.loginForm.controls.confirmPassword.value
        );
      },
      (error) => {}
    );
  }

  redirectToTeam() {
    if (this.authService.loggedIn()) {
      this.router.navigate(["/dashboard"]);
    }
  }

  // to open forget password dialog then the OTP dialog, then the Update password Dialog
  openDialog() {
    const dialogRef = this.dialog.open(ForgotPasswordDialog, {
      width: "90%",
      maxWidth: "30em",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const resetPassword = {
          otp: "string",
          phone: result.value.phone,
          password: "string",
        };
        const data = {
          reset_method: "mobile",
          phone: result.value.phone,
        };
        this.authService.forgotPassword(data, "").subscribe(
          (response: any) => {
            if (response.body.message === "otp sent") {
              const userId = response.body.user_id;
              const otpDialog = this.dialog.open(OTPComponent, {
                width: "90%",
                maxWidth: "30em",
              });

              otpDialog.afterClosed().subscribe((data) => {
                if (data) {
                  resetPassword.otp = data.value.otp;
                  this.authService
                    .sendOTP(data.value, "?id=" + userId)
                    .subscribe(
                      (response: any) => {
                        if (response.verified) {
                          const updateDialog = this.dialog.open(
                            UpdatePasswordComponent,
                            {
                              width: "90%",
                              maxWidth: "30em",
                            }
                          );
                          updateDialog.afterClosed().subscribe((data) => {
                            if (data) {
                              resetPassword.password = data.value.newPwd;
                              this.authService
                                .updatePassword(resetPassword, "")
                                .subscribe(
                                  (res) => {
                                    this._snackbar.open(
                                      "Password Updated, You can Login now",
                                      "",
                                      {
                                        duration: 5000,
                                      }
                                    );
                                  },
                                  (error) => {
                                    this._snackbar.open(
                                      "Error Occured, try after sometime",
                                      "",
                                      {
                                        duration: 5000,
                                      }
                                    );
                                  }
                                );
                            }
                          });
                        } else {
                          this._snackbar.open("Incorrect OTP", "", {
                            duration: 5000,
                          });
                        }
                      },
                      (error) => {
                        this._snackbar.open(
                          "Error Occured, try after sometime",
                          "",
                          {
                            duration: 5000,
                          }
                        );
                      }
                    );
                }
              });
            } else {
              this._snackbar.open("Incorrect Mobile Number", "", {
                duration: 5000,
              });
            }
          },
          (error) => {
            this._snackbar.open("Error Occured, try after sometime", "", {
              duration: 5000,
            });
          }
        );
      }
    });
  }
}

// ForgotPassword dialog box
@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgotPasswordDialog.component.html",
  styleUrls: ["./forgotPasswordDialog.component.scss"],
})
export class ForgotPasswordDialog {
  form;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ForgotPasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = this.fb.group({
      phone: ["", [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// OTP dialog box
@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OTPComponent {

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OTPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  form = this.formBuilder.group({
    otp: ["", [Validators.required]],
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  countDown: Subscription;
  counter = 600;
  tick = 1000;
  ngOnInit() {
    this.countDown = timer(0, this.tick).subscribe(() => {
      if (this.counter === 0) {
        this.onNoClick();
      }
      --this.counter;
    });
  }
  ngOnDestroy() {
    this.countDown = null;
  }
}

// UpdatePassword Dialog box
@Component({
  selector: "app-update-password",
  templateUrl: "./updatePassword.component.html",
  styleUrls: ["./updatePassword.component.scss"],
})
export class UpdatePasswordComponent {
  pass: string;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  form = this.fb.group(
    {
      newPwd: [
        "",
        Validators.compose([
          Validators.required,
          OldPwdValidators.patternValidator(/\d/, {
            hasNumber: true,
          }),
          OldPwdValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true,
          }),
          OldPwdValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true,
          }),
          OldPwdValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true,
            }
          ),
          Validators.minLength(8),
        ]),
      ],
      confirmPwd: ["", Validators.required],
    },
    {
      validator: [OldPwdValidators.matchPwds],
    }
  );

  get newPwd() {
    return this.form.get("newPwd");
  }

  get confirmPwd() {
    return this.form.get("confirmPwd");
  }

  checkPasswordValidity(p: FormGroup) {
    return p.get("password").value === p.get("passwordConfirm").value
      ? null
      : { mismatch: true };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
