import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {

  comp1Val: string;
  _comp1ValueBS = new BehaviorSubject<string>('');

  comp2Val: string;
  _comp2ValueBS = new BehaviorSubject<string>('');

  constructor() {
    this.comp1Val;
    this.comp2Val;

    this._comp1ValueBS.next(this.comp1Val);
    this._comp2ValueBS.next(this.comp2Val);
  }

  updateComp1Val(val) {
    this.comp1Val = val;
    this._comp1ValueBS.next(this.comp1Val);
  }

  updateComp2Val(val) {
    this.comp2Val = val;
    this._comp2ValueBS.next(this.comp2Val);
  }

}