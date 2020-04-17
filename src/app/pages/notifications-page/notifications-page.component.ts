import { NewOrderNotification } from './../../constants/mockup-data';
import { Router } from '@angular/router';
import { NotificationsService } from './../../services/notifications.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent implements OnInit {
  constructor(private notificationsService: NotificationsService, private router: Router) { }
  newOrderStatus: any;
  criticalOrderStatus: any;
  cancelOrderStatus: any;
  newOrderNotification: any[] = [];
  cancelOrderNotification: any[] = [];
  critcalOrderNotification: any[] = [];
  newOdd = true;
  cancelOdd = true;
  criticalOdd = true;
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
  dupOrderedNotifcation: any;
  dupCancelNotifcation: any;
  dupCriticalNotifcation: any;
  cancelNotification: any;
  newOrderedStatus: any;
  cancelOrderedStatus: any;
  date: any;
  actualTime: any;
  time: any;
  formatDate: any;
  newOrderTime: any = [];
  cancelOrderTime: any = [];
  criticalOrderTime: any = [];
  criticalDelivery = ['Cancelled', 'Delivered' ];
  newOrderRemove = [];
  cancelOrderRemove = [];
  criticalOrderRemove = [];
  myNewOrder = [];
  newOrderDateSet: any;
  newOrderTimeSet: any;
  cancelOrderSet: any;
  cancelOrderDateSet: any;
  cancelOrderTimeSet: any;
  criticalOrderSet: any;
  criticalOrderDateSet: any;
  criticalOrderTimeSet: any;
  newFilteredArray = [];
  cancelFilteredArray = [];
  criticalFilteredArray = [];
  notifylen: number;
  newOrderDate = [];
  cancelOrderDate = [];
  criticalOrderDate = [];
  newOrders: number;
  cancelOrders: number;
  criticalOrders: number;
  pos = true;
  change = 'false';
  newbillno: any ;
  cancelbillno: any ;
  criticalbillno: any ;
  deliveryTime: any;
  ngOnInit() {
    this.newOrderStatus = localStorage.getItem('newOrder');
    this.cancelOrderStatus = localStorage.getItem('cancelOrder');
    this.criticalOrderStatus = localStorage.getItem('criticalOrder');
    this.change = 'false';
    localStorage.setItem('change', this.change);
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
    this.newOdd = false;
    let i = 0;
    this.orderedNotification.forEach(element => {
      i++;
      this.date = new Date(element.timestamp);
      this.formatDate = ('0' + this.date.getDate()).slice(-2) + '/' + ('0' +
                  (this.date.getMonth() + 1)).slice(-2) + '/' + this.date.getFullYear();
      if (i <= 30) {
        this.newOrderFilter.push(element);
        this.time = new Date(element.timestamp);
        this.actualTime = this.time.toLocaleTimeString();
        this.newOrderTime.push(this.actualTime);
        this.newOrderDate.push(this.formatDate);
      }
    });
    this.newFilteredArray = this.newOrderFilter.filter( (x)  => this.newOrderRemove.indexOf(x) < 0);
    this.newOrders = this.newFilteredArray.length;
    this.newbillno = localStorage.getItem('newnotify');
    if (this.newFilteredArray.length > 0) {
      if (this.newbillno !== this.newFilteredArray[0].bill_no) {
        this.newbillno = this.newFilteredArray[0].bill_no;
        localStorage.setItem('newnotify', this.newbillno);
        this.change = 'true';
        localStorage.setItem('change', this.change);
      }
      this.newOrderRemove = this.newOrderRemove.concat(this.newOrderFilter);
    }
  }

  cancelOrderFun() {
    let i = 0;
    this.cancelNotification.forEach(element => {
      i++;
      this.date = new Date(element.timestamp);
      this.formatDate = ('0' + this.date.getDate()).slice(-2) + '/' + ('0' +
                  (this.date.getMonth() + 1)).slice(-2) + '/' + this.date.getFullYear();
      if (i <= 30) {
        this.cancelOrderFilter.push(element);
        this.time = new Date(element.timestamp);
        this.actualTime = this.time.toLocaleTimeString();
        this.cancelOrderTime.push(this.actualTime);
        this.cancelOrderDate.push(this.formatDate);
      }
    });
    this.cancelFilteredArray = this.cancelOrderFilter.filter( (x)  => this.cancelOrderRemove.indexOf(x) < 0);
    this.cancelOrders = this.cancelFilteredArray.length;
    this.cancelbillno = localStorage.getItem('cancelnotify');
    if (this.cancelFilteredArray.length > 0) {
      if (this.cancelbillno !== this.cancelFilteredArray[0].bill_no) {
        this.cancelbillno = this.cancelFilteredArray[0].bill_no;
        localStorage.setItem('cancelnotify', this.cancelbillno);
        this.change = 'true';
        localStorage.setItem('change', this.change);
      }
      this.cancelOrderRemove = this.cancelOrderRemove.concat(this.cancelOrderFilter);
    }
  }

  criticalOrderFun() {
    this.time = new Date().getTime();
    this.notifications.forEach(element => {
      this.date = new Date(element.timestamp);
      this.deliveryTime = this.date.getTime();
      this.deliveryTime += 7200000;
      if (((this.deliveryTime - this.time) <= 1800000 && (this.deliveryTime - this.time) >= 0
            && !(this.criticalDelivery.includes(element.status)))) {

            this.criticalOrder.push(element);
      }
    });
    let i = 0;
    this.criticalOrder.forEach(element => {
      i++;
      this.date = new Date(element.timestamp);
      this.formatDate = ('0' + this.date.getDate()).slice(-2) + '/' + ('0' +
                  (this.date.getMonth() + 1)).slice(-2) + '/' + this.date.getFullYear();
      if (i <= 30) {
        this.criticalOrderFilter.push(element);
        this.time = new Date(element.timestamp);
        this.actualTime = this.time.toLocaleTimeString();
        this.criticalOrderTime.push(this.actualTime);
        this.criticalOrderDate.push(this.formatDate);
      }
    });
    this.criticalFilteredArray = this.criticalOrderFilter.filter( (x)  => this.criticalOrderRemove.indexOf(x) < 0);
    this.criticalOrders = this.criticalFilteredArray.length;
    this.criticalbillno = localStorage.getItem('criticalnotify');
    if (this.criticalFilteredArray.length > 0) {
      if (this.criticalbillno !== this.criticalFilteredArray[0].bill_no) {
        this.criticalbillno = this.criticalFilteredArray[0].bill_no;
        localStorage.setItem('criticalnotify', this.criticalbillno);
        this.change = 'true';
        localStorage.setItem('change', this.change);
      }
      this.criticalOrderRemove = this.criticalOrderRemove.concat(this.criticalOrderFilter);
    }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.change = 'false';
    localStorage.setItem('change', this.change);
  }
}
