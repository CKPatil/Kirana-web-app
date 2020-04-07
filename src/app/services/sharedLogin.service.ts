import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
export interface ResetPassword{
    otp: string;
    phoneNumber: string;
    newPassword: string;
}

@Injectable()
export class SharedLoginService{
    resetPassword={
        otp: 'string',
        phoneNumber: 'string',
        newPassword: 'string'
    }
    response:any;
    _responseValueBS= new BehaviorSubject<Object>('');

    constructor(){
        this.response;
        this._responseValueBS.next(this.response);
        this.resetPassword;
    }
    updateResponse(obj){
        this.response=obj;
        this._responseValueBS.next(this.response);
    }
}