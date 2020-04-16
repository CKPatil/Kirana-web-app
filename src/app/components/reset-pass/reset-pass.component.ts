import { ResetpasswordService } from './../../services/resetpassword.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { Component, Output, Input, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OldPwdValidators } from './old-password.validators';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { ResetPassword} from '../../models/models';
@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent {
  resetPass = new ResetPassword();
  form1: FormGroup;
  mess: string;
  message = 'Password changed sucessfully';
  errMessage = 'Old Password not valid !!!';
  actionButtonLabel = 'OK';
  action = true;
  setAutoHide = true;
  autoHide = 2000;
  isSidePanelExpanded: boolean;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(fb: FormBuilder, private interaction: InteractionService, public snackBar: MatSnackBar,
              private resetpasswordService: ResetpasswordService, public dialogRef: MatDialogRef<ResetPassComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
    this.form1 = fb.group({
      oldPwd: [''],
      newPwd: ['', Validators.required],
      confirmPwd: ['', Validators.required]
    }, {
      validator: OldPwdValidators.matchPwds
    });
  }
  get oldPwd() {
    return this.form1.get('oldPwd');
  }

   get newPwd() {
    return this.form1.get('newPwd');
  }

   get confirmPwd() {
    return this.form1.get('confirmPwd');
  }
  openSnackBar() {
    this.resetPass.old_password = this.form1.controls.oldPwd.value;
    this.resetPass.new_password = this.form1.controls.newPwd.value;
    this.resetpasswordService.addNewPassword(this.resetPass)
      .subscribe(res => {
          this.mess = res.body.message;
          if (this.mess === 'password updated') {
            this.snackBar.open(this.message, this.actionButtonLabel);
          }
          if (this.mess === 'failed') {
            this.snackBar.open(this.errMessage, this.actionButtonLabel);
          }
      });
    this.form1.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
