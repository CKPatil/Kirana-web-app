import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NotificationService {
  private newOrderSource = new BehaviorSubject<string>('');
  newOrderSetting$ = this.newOrderSource.asObservable();

  private criticalOrderSource = new BehaviorSubject<string>('');
  criticalOrderSetting$ = this.criticalOrderSource.asObservable();

  private cancelOrderSource = new BehaviorSubject<string>('');
  cancelOrderSetting$ = this.cancelOrderSource.asObservable();

  constructor() { }

  sendNewOrder(newOrderStatus: string) {
    this.newOrderSource.next(newOrderStatus);
  }

  sendCriticalOrder(criticalOrderStatus: string) {
    this.criticalOrderSource.next(criticalOrderStatus);
  }

  sendCancelOrder(cancelOrderStatus: string) {
    this.cancelOrderSource.next(cancelOrderStatus);
  }
}
