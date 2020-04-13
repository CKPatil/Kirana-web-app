import { Router } from '@angular/router';
import { NotificationsService } from './../../services/notifications.service';
import { NewOrderNotification, CancelledOrderNotification, CriticalOrderNotification } from './../../constants/mockup-data';
import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent implements OnInit {
  constructor(private notificationsService: NotificationsService, private router: Router) { }
  message = 'Password changed sucessfully';
  errMessage = 'Old Password not valid !!!';
  actionButtonLabel = 'OK';
  snackBar: any;
  panelOpenState = false;
  newOrderStatus: any;
  criticalOrderStatus: any;
  cancelOrderStatus: any;
  mockNewOrderNotification = NewOrderNotification;
  mockCancelledOrderNotification = CancelledOrderNotification;
  mockCriticalOrderNotification = CriticalOrderNotification;
  newOrderNotification: any[] = [];
  cancelOrderNotification: any[] = [];
  critcalOrderNotification: any[] = [];
  today = new Date();
  formattedTodayDate = ('0' + this.today.getDate()).slice(-2) + '/' + ('0' +
                  (this.today.getMonth() + 1)).slice(-2) + '/' + this.today.getFullYear();
  newOrd: any;
  cancelOrd: any;
  criticalOrder: any = [];
  newOrderFilter: any = [];
  criticalOrderFilter: any = [];
  cancelOrderFilter: any = [];
  notifications: any[];
  newStatus = 'Ordered';
  cancelledStatus = 'Cancelled';
  orderedNotification: any;
  cancelNotification: any;
  newOrderedStatus: any;
  cancelOrderedStatus: any;
  date: any;
  time: any;
  formatDate: any;
  newOrderDate: any = [];
  newOrderTime: any = [];
  cancelOrderDate: any = [];
  cancelOrderTime: any = [];
  criticalOrderDate: any = [];
  criticalOrderTime: any = [];
  criticalDelivery = ['Cancelled', 'Delivered' ];
  ngOnInit() {
    this.newOrderStatus = localStorage.getItem('newOrder');
    this.cancelOrderStatus = localStorage.getItem('cancelOrder');
    this.criticalOrderStatus = localStorage.getItem('criticalOrder');
    this.newNotify();
    setInterval( () => {
      this.newNotify();
    }, 10000);
  }
  newNotify() {
    this.notificationsService.getAllNotifications()
      .subscribe( data => {
        this.notifications = data;
        this.notifications = this.notifications.reverse();
        this.newOrderedStatus = {records: this.notifications};
        this.orderedNotification = this.newOrderedStatus.records.filter( (i: { status: string; }) => this.newStatus.includes(i.status));
        this.cancelOrderedStatus = {records: this.notifications};
        this.cancelNotification = this.cancelOrderedStatus.records.filter( (i: { status: string; }) =>
                                  this.cancelledStatus.includes(i.status));
        this.newOrderFun();
        this.cancelOrderFun();
        this.criticalOrderFun();
      });
    console.log('done');
  }
  pad = (num)  => ('0' + num).slice(-2);
  getTimeFromDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return this.pad(hours) + ':' + this.pad(minutes) + ':' + this.pad(seconds);
  }
  newOrderFun() {
    this.orderedNotification.forEach(element => {
      this.date = new Date(element.timestamp);
      this.formatDate = ('0' + this.date.getDate()).slice(-2) + '/' + ('0' +
                  (this.date.getMonth() + 1)).slice(-2) + '/' + this.date.getFullYear();
      if (this.formatDate === this.formattedTodayDate) {
        this.newOrderFilter.push(element);
        this.newOrderDate.push(this.formatDate);
        this.time = this.getTimeFromDate(this.date.getTime());
        this.newOrderTime.push(this.time);
      }
    });
  }

  cancelOrderFun() {
    this.cancelNotification.forEach(element => {
      this.date = new Date(element.timestamp);
      this.formatDate = ('0' + this.date.getDate()).slice(-2) + '/' + ('0' +
                  (this.date.getMonth() + 1)).slice(-2) + '/' + this.date.getFullYear();
      // if (this.formatDate === this.formattedTodayDate) {
      this.cancelOrderFilter.push(element);
      this.cancelOrderDate.push(this.formatDate);
      this.time = this.getTimeFromDate(this.date.getTime());
      this.cancelOrderTime.push(this.time);
      // }
    });
  }

  criticalOrderFun() {
    this.time = new Date().getTime();
    this.notifications.forEach(element => {
      this.date = new Date(element.remaining_time);
      if (((this.date.getTime() - this.time) <= 20000 && (this.date.getTime() - this.time) >= 0
            && !(this.criticalDelivery.includes(element.status)))) {

            this.criticalOrder.push(element);
      }
    });
    this.criticalOrder.forEach(element => {
      this.date = new Date(element.timestamp);
      this.formatDate = ('0' + this.date.getDate()).slice(-2) + '/' + ('0' +
                  (this.date.getMonth() + 1)).slice(-2) + '/' + this.date.getFullYear();
      if (this.formatDate === this.formattedTodayDate) {
        this.criticalOrderFilter.push(element);
        this.criticalOrderDate.push(this.formatDate);
        this.time = this.getTimeFromDate(this.date.getTime());
        this.criticalOrderTime.push(this.time);
      }
    });
  }
}
