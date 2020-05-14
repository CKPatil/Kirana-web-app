import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export class OldPwdValidators {

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  static matchPwds(control: AbstractControl) {
    const newPwd2 = control.get('newPwd');
    const confirmPwd2 = control.get('confirmPwd');
    if (newPwd2.value !== confirmPwd2.value) {
      return { pwdsDontMatch: true };
    }
    return null;
  }
}
