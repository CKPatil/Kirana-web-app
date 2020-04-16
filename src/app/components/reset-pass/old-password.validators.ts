import { LoginComponent } from './../../pages/login/login.component';
import { AbstractControl, ValidationErrors } from '@angular/forms';
export class OldPwdValidators {

  static shouldBeOldOne(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
        if (control.value !== 'kirana') {
          resolve({ shouldBeOldOne: true });
        } else {
          resolve(null);
        }
    });
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
