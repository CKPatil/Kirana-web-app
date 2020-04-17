import { NewOrderNotification } from './../../constants/mockup-data';
import { Router } from '@angular/router';
import { NotificationsService } from './../../services/notifications.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent implements OnInit, OnDestroy {
  constructor(private notificationsService: NotificationsService, private router: Router) { }
  newOrderStatus: any;
  criticalOrderStatus: any;
  cancelOrderStatus: any;
  packedOrderStatus: any;
  dispatchedOrderStatus: any;
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
  packedOrderFilter: any = [];
  dispatchedOrderFilter: any = [];
  notifications: any[];
  newStatus = 'Ordered';
  cancelledStatus = 'Cancelled';
  packedStatus = 'Packed';
  dispatchedStatus = 'Dispatched';
  orderedNotification: any;
  dupOrderedNotifcation: any;
  dupCancelNotifcation: any;
  dupCriticalNotifcation: any;
  cancelNotification: any;
  packedNotification: any;
  dispatchedNotification: any;
  newOrderedStatus: any;
  cancelOrderedStatus: any;
  packedOrderedStatus: any;
  dispatchedOrderedStatus: any;
  date: any;
  actualTime: any;
  time: any;
  formatDate: any;
  newOrderTime: any = [];
  cancelOrderTime: any = [];
  criticalOrderTime: any = [];
  packedOrderTime: any = [];
  dispatchedOrderTime: any = [];
  criticalDelivery = ['Cancelled', 'Delivered' ];
  newOrderRemove = [];
  cancelOrderRemove = [];
  criticalOrderRemove = [];
  packedOrderRemove  = [];
  dispatchedOrderRemove = [];
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
  packedFilteredArray = [];
  dispatchedFilteredArray = [];
  notifylen: number;
  newOrderDate = [];
  cancelOrderDate = [];
  criticalOrderDate = [];
  packedOrderDate = [];
  dispatchedOrderDate = [];
  newOrders: number;
  cancelOrders: number;
  criticalOrders: number;
  packedOrders: number;
  dispatchedOrders: number;
  pos = true;
  change = 'false';
  newBillno: any ;
  cancelBillno: any ;
  criticalBillno: any ;
  packedBillno: any;
  dispatchedBillno: any;
  deliveryTime: any;
  invitation = [];
  invitationStatus: any;
  invitationFilter = [];
  invitationFilteredArray = [];
  invitationRemove = [];
  newInvitee: any;
  notificationToBeOpened: any;

  ngOnInit() {
    this.newOrderStatus = localStorage.getItem('newOrder');
    this.cancelOrderStatus = localStorage.getItem('cancelOrder');
    this.criticalOrderStatus = localStorage.getItem('criticalOrder');
    this.packedOrderStatus = localStorage.getItem('packedOrder');
    this.dispatchedOrderStatus = localStorage.getItem('dispatchedOrder');
    // this.notificationToBeOpened = localStorage.getItem('notificationToBeOpened');
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
        this.packedOrderedStatus = {records: this.notifications};
        this.packedNotification = this.packedOrderedStatus.records.filter( (i: { status: string; }) =>
                                  this.packedStatus.includes(i.status));
        this.dispatchedOrderedStatus = {records: this.notifications};
        this.dispatchedNotification = this.dispatchedOrderedStatus.records.filter( (i: { status: string; }) =>
                                  this.dispatchedStatus.includes(i.status));
        this.newOrderFun();
        this.cancelOrderFun();
        this.criticalOrderFun();
        this.packedOrderFun();
        this.dispatchedFun();
      });

    this.notificationsService.getInviteNotifications()
      .subscribe( data => {
        this.invitation = data;
        this.invitation = this.invitation.reverse();
        if (this.invitation.length > 10) {
          for ( let i = 0; i < 10; i++) {
            this.invitationFilter[i] = this.invitation[i];
          }
        } else {
          for ( let i = 0; i < this.invitation.length; i++) {
            this.invitationFilter[i] = this.invitation[i];
          }
        }
        this.invitationFilteredArray = this.invitationFilter.filter( (x)  => this.invitationRemove.indexOf(x) < 0);
        this.newInvitee = localStorage.getItem('newInvitation');
        if (this.invitationFilteredArray.length > 0) {
          if (this.newInvitee !== this.invitationFilteredArray[0].name) {
            this.newInvitee = this.invitationFilteredArray[0].name;
            localStorage.setItem('newInvitation', this.newInvitee);
            this.change = 'true';
            // this.notificationToBeOpened = '1';
            // localStorage.setItem('notificationToBeOpened', this.notificationToBeOpened);
            localStorage.setItem('change', this.change);
          }
          this.invitationRemove = this.invitationRemove.concat(this.invitationFilter);
        }
      });
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
    this.newBillno = localStorage.getItem('newnotify');
    if (this.newFilteredArray.length > 0) {
      if (this.newBillno !== this.newFilteredArray[0].bill_no) {
        this.newBillno = this.newFilteredArray[0].bill_no;
        localStorage.setItem('newnotify', this.newBillno);
        this.change = 'true';
        // this.notificationToBeOpened = '1';
        // localStorage.setItem('notificationToBeOpened', this.notificationToBeOpened);
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
    this.cancelBillno = localStorage.getItem('cancelnotify');
    if (this.cancelFilteredArray.length > 0) {
      if (this.cancelBillno !== this.cancelFilteredArray[0].bill_no) {
        this.cancelBillno = this.cancelFilteredArray[0].bill_no;
        localStorage.setItem('cancelnotify', this.cancelBillno);
        this.change = 'true';
        // this.notificationToBeOpened = '2';
        // localStorage.setItem('notificationToBeOpened', this.notificationToBeOpened);
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
    this.criticalBillno = localStorage.getItem('criticalnotify');
    if (this.criticalFilteredArray.length > 0) {
      if (this.criticalBillno !== this.criticalFilteredArray[0].bill_no) {
        this.criticalBillno = this.criticalFilteredArray[0].bill_no;
        localStorage.setItem('criticalnotify', this.criticalBillno);
        this.change = 'true';
        // this.notificationToBeOpened = '3';
        // localStorage.setItem('notificationToBeOpened', this.notificationToBeOpened);
        localStorage.setItem('change', this.change);
      }
      this.criticalOrderRemove = this.criticalOrderRemove.concat(this.criticalOrderFilter);
    }
  }

  packedOrderFun() {
    let i = 0;
    this.packedNotification.forEach(element => {
      i++;
      this.date = new Date(element.timestamp);
      this.formatDate = ('0' + this.date.getDate()).slice(-2) + '/' + ('0' +
                  (this.date.getMonth() + 1)).slice(-2) + '/' + this.date.getFullYear();
      if (i <= 30) {
        this.packedOrderFilter.push(element);
        this.time = new Date(element.timestamp);
        this.actualTime = this.time.toLocaleTimeString();
        this.packedOrderTime.push(this.actualTime);
        this.packedOrderDate.push(this.formatDate);
      }
    });
    this.packedFilteredArray = this.packedOrderFilter.filter( (x)  => this.packedOrderRemove.indexOf(x) < 0);
    this.packedOrders = this.packedFilteredArray.length;
    this.packedBillno = localStorage.getItem('packednotify');
    if (this.packedFilteredArray.length > 0) {
      if (this.packedBillno !== this.packedFilteredArray[0].bill_no) {
        this.packedBillno = this.packedFilteredArray[0].bill_no;
        localStorage.setItem('packednotify', this.packedBillno);
        this.change = 'true';
        // this.notificationToBeOpened = '4';
        // localStorage.setItem('notificationToBeOpened', this.notificationToBeOpened);
        localStorage.setItem('change', this.change);
      }
      this.packedOrderRemove = this.packedOrderRemove.concat(this.packedOrderFilter);
    }
  }

  dispatchedFun() {
    let i = 0;
    this.dispatchedNotification.forEach(element => {
      i++;
      this.date = new Date(element.timestamp);
      this.formatDate = ('0' + this.date.getDate()).slice(-2) + '/' + ('0' +
                  (this.date.getMonth() + 1)).slice(-2) + '/' + this.date.getFullYear();
      if (i <= 30) {
        this.dispatchedOrderFilter.push(element);
        this.time = new Date(element.timestamp);
        this.actualTime = this.time.toLocaleTimeString();
        this.dispatchedOrderTime.push(this.actualTime);
        this.dispatchedOrderDate.push(this.formatDate);
      }
    });
    this.dispatchedFilteredArray = this.dispatchedOrderFilter.filter( (x)  => this.dispatchedOrderRemove.indexOf(x) < 0);
    this.dispatchedOrders = this.dispatchedFilteredArray.length;
    this.dispatchedBillno = localStorage.getItem('dispatchednotify');
    if (this.dispatchedFilteredArray.length > 0) {
      if (this.dispatchedBillno !== this.dispatchedFilteredArray[0].bill_no) {
        this.dispatchedBillno = this.dispatchedFilteredArray[0].bill_no;
        localStorage.setItem('dispatchednotify', this.dispatchedBillno);
        this.change = 'true';
        // this.notificationToBeOpened = '5';
        // localStorage.setItem('notificationToBeOpened', this.notificationToBeOpened);
        localStorage.setItem('change', this.change);
      }
      this.dispatchedOrderRemove = this.dispatchedOrderRemove.concat(this.dispatchedOrderFilter);
    }
  }

  ngOnDestroy() {
    this.change = 'false';
    localStorage.setItem('change', this.change);
  }
}
