import {
  NewOrderNotification,
  transactions,
} from './../../constants/mockup-data';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { RetailerService } from './../../services/retailer.service';
@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss'],
})
export class NotificationsPageComponent implements OnInit, OnDestroy {
  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private retailerService: RetailerService
  ) {}

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
  formattedTodayDate =
    ('0' + this.today.getDate()).slice(-2) +
    '/' +
    ('0' + (this.today.getMonth() + 1)).slice(-2) +
    '/' +
    this.today.getFullYear();
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
  orderedNotification: any = [];
  dupOrderedNotifcation: any;
  dupCancelNotifcation: any;
  dupCriticalNotifcation: any;
  cancelNotification: any = [];
  packedNotification: any = [];
  dispatchedNotification: any = [];
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
  criticalDelivery = ['Cancelled', 'Delivered'];
  newOrderRemove = [];
  cancelOrderRemove = [];
  criticalOrderRemove = [];
  packedOrderRemove = [];
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
  prevNewBillno: any;
  prevCancelBillno: any;
  prevCriticalBillno: any;
  prevPackedBillno: any;
  prevDispatchedBillno: any;
  newBillno: any;
  cancelBillno: any;
  criticalBillno: any;
  packedBillno: any;
  dispatchedBillno: any;
  deliveryTime: any;
  invitation: any;
  invitationStatus: any;
  invitationFilter: any = [];
  invitationFilteredArray = [];
  invitationRemove = [];
  newInvitee: any;
  inviteStatus: any;
  notificationToBeOpened: any;
  invite = false;
  // tslint:disable-next-line: variable-name
  new_ = false;
  cancel = false;
  packed = false;
  dispatch = false;
  critical = false;
  newLen: any = 0;
  cancelLen: any = 0;
  packedLen: any = 0;
  dispatchLen: any = 0;
  invitationLen: any = 0;
  ngOnInit() {
    this.newOrderStatus = localStorage.getItem('newOrder');
    this.cancelOrderStatus = localStorage.getItem('cancelOrder');
    this.criticalOrderStatus = localStorage.getItem('criticalOrder');
    this.packedOrderStatus = localStorage.getItem('packedOrder');
    this.dispatchedOrderStatus = localStorage.getItem('dispatchedOrder');
    this.inviteStatus = localStorage.getItem('inviteStatus');
    this.change = 'false';
    localStorage.setItem('change', this.change);
    this.newNotify();
    setInterval(() => {
      this.newNotify();
    }, 60000);
  }
  newNotify() {
    this.notificationToBeOpened = localStorage.getItem(
      'notificationToBeOpened'
    );
    this.transactionService.observeOrders.subscribe((data) => {
      this.notifications = data;
      this.notifications = this.notifications.reverse();
      this.newOrderedStatus = { records: this.notifications };
      this.orderedNotification = this.newOrderedStatus.records.filter(
        (i: { status: string }) => this.newStatus.includes(i.status)
      );
      this.cancelOrderedStatus = { records: this.notifications };
      this.cancelNotification = this.cancelOrderedStatus.records.filter(
        (i: { status: string }) => this.cancelledStatus.includes(i.status)
      );
      this.packedOrderedStatus = { records: this.notifications };
      this.packedNotification = this.packedOrderedStatus.records.filter(
        (i: { status: string }) => this.packedStatus.includes(i.status)
      );
      this.dispatchedOrderedStatus = { records: this.notifications };
      this.dispatchedNotification = this.dispatchedOrderedStatus.records.filter(
        (i: { status: string }) => this.dispatchedStatus.includes(i.status)
      );
      this.newOrderFun();
      this.cancelOrderFun();
      this.criticalOrderFun();
      this.packedOrderFun();
      this.dispatchedFun();
    });

    this.retailerService.observeInviteRequests.subscribe((data) => {
      this.invitation = data;
      this.invitation = this.invitation.reverse();
      this.invitationLen = localStorage.getItem('invitationLength');
      for (let i = 0; i < this.invitation.length - this.invitationLen; i++) {
        this.invitationFilter[i] = this.invitation[i];
      }
      // if (this.invitation.length > 10) {
      //   for (let i = 0; i < 10; i++) {
      //     this.invitationFilter[i] = this.invitation[i];
      //   }
      // } else {
      //   for (let i = 0; i < this.invitation.length; i++) {
      //     this.invitationFilter[i] = this.invitation[i];
      //   }
      // }
      // this.invitationFilteredArray = this.invitationFilter.filter(
      //   (x) => this.invitationRemove.indexOf(x) < 0
      // );
      // this.newInvitee = localStorage.getItem('newInvitation');
      // if (this.invitationFilteredArray.length > 0) {
      //   if (this.newInvitee !== this.invitationFilteredArray[0].name) {
      //     this.newInvitee = this.invitationFilteredArray[0].name;
      //     localStorage.setItem('newInvitation', this.newInvitee);
      //     if (this.inviteStatus === 'true') {
      //       this.change = 'true';
      //       localStorage.setItem('change', this.change);
      //     }
      //     this.notificationToBeOpened = '0';
      //     localStorage.setItem(
      //       'notificationToBeOpened',
      //       this.notificationToBeOpened
      //     );
      //   }
      //   this.invitationRemove = this.invitationRemove.concat(
      //     this.invitationFilter
      //   );
      // }
    });
  }

  newOrderFun() {
    this.newLen = localStorage.getItem('newLength');
    for (let i = 0; i < this.orderedNotification.length - this.newLen; i++) {
      this.newFilteredArray[i] = this.orderedNotification[i];
      this.date = new Date(this.newFilteredArray[i].timestamp);
      this.formatDate =
        ('0' + this.date.getDate()).slice(-2) +
        '/' +
        ('0' + (this.date.getMonth() + 1)).slice(-2) +
        '/' +
        this.date.getFullYear();
      this.time = new Date(this.newFilteredArray[i].timestamp);
      this.actualTime = this.time.toLocaleTimeString();
      this.newOrderTime.push(this.actualTime);
      this.newOrderDate.push(this.formatDate);
    }
    // this.newFilteredArray = this.newOrderFilter.filter(
    //   (x) => this.newOrderRemove.indexOf(x) < 0
    // );
    // this.newOrders = this.newFilteredArray.length;
    // this.newBillno = localStorage.getItem('newnotify');
    // if (this.newFilteredArray.length > 0) {
    //   if (this.newBillno !== this.newFilteredArray[0].bill_no) {
    //     this.newBillno = this.newFilteredArray[0].bill_no;
    //     localStorage.setItem('newnotify', this.newBillno);
    //     if (this.newOrderStatus === 'true') {
    //       this.change = 'true';
    //       localStorage.setItem('change', this.change);
    //     }
    //     this.notificationToBeOpened = '1';
    //     localStorage.setItem(
    //       'notificationToBeOpened',
    //       this.notificationToBeOpened
    //     );
    //   }
    //   this.newOrderRemove = this.newOrderRemove.concat(this.newOrderFilter);
    // }
  }

  cancelOrderFun() {
    this.cancelLen = localStorage.getItem('cancelLength');
    for (let i = 0; i < this.cancelNotification.length - this.cancelLen; i++) {
      this.cancelFilteredArray[i] = this.cancelNotification[i];
      this.date = new Date(this.cancelFilteredArray[i].timestamp);
      this.formatDate =
        ('0' + this.date.getDate()).slice(-2) +
        '/' +
        ('0' + (this.date.getMonth() + 1)).slice(-2) +
        '/' +
        this.date.getFullYear();
      this.time = new Date(this.cancelFilteredArray[i].timestamp);
      this.actualTime = this.time.toLocaleTimeString();
      this.newOrderTime.push(this.actualTime);
      this.newOrderDate.push(this.formatDate);
    }
    // this.cancelFilteredArray = this.cancelOrderFilter.filter(
    //   (x) => this.cancelOrderRemove.indexOf(x) < 0
    // );
    // this.cancelOrders = this.cancelFilteredArray.length;
    // this.cancelBillno = localStorage.getItem('cancelnotify');
    // if (this.cancelFilteredArray.length > 0) {
    //   if (this.cancelBillno !== this.cancelFilteredArray[0].bill_no) {
    //     this.cancelBillno = this.cancelFilteredArray[0].bill_no;
    //     localStorage.setItem('cancelnotify', this.cancelBillno);
    //     if (this.cancelOrderStatus === 'true') {
    //       this.change = 'true';
    //       localStorage.setItem('change', this.change);
    //     }
    //     this.notificationToBeOpened = '2';
    //     localStorage.setItem(
    //       'notificationToBeOpened',
    //       this.notificationToBeOpened
    //     );
    //   }
    //   this.cancelOrderRemove = this.cancelOrderRemove.concat(
    //     this.cancelOrderFilter
    //   );
    // }
  }

  criticalOrderFun() {
    this.time = new Date().getTime();
    this.notifications.forEach((element) => {
      this.date = new Date(element.timestamp);
      this.deliveryTime = this.date.getTime();
      this.deliveryTime += 7200000;
      if (
        this.deliveryTime - this.time <= 1800000 &&
        this.deliveryTime - this.time >= 0 &&
        !this.criticalDelivery.includes(element.status)
      ) {
        this.criticalOrder.push(element);
      }
    });
    let i = 0;
    this.criticalOrder.forEach((element) => {
      i++;
      this.date = new Date(element.timestamp);
      this.formatDate =
        ('0' + this.date.getDate()).slice(-2) +
        '/' +
        ('0' + (this.date.getMonth() + 1)).slice(-2) +
        '/' +
        this.date.getFullYear();
      if (i <= 30) {
        this.criticalOrderFilter.push(element);
        this.time = new Date(element.timestamp);
        this.actualTime = this.time.toLocaleTimeString();
        this.criticalOrderTime.push(this.actualTime);
        this.criticalOrderDate.push(this.formatDate);
      }
    });
    this.criticalFilteredArray = this.criticalOrderFilter.filter(
      (x) => this.criticalOrderRemove.indexOf(x) < 0
    );
    this.criticalOrders = this.criticalFilteredArray.length;
    this.criticalBillno = localStorage.getItem('criticalnotify');
    if (this.criticalFilteredArray.length > 0) {
      if (this.criticalBillno !== this.criticalFilteredArray[0].bill_no) {
        this.criticalBillno = this.criticalFilteredArray[0].bill_no;
        localStorage.setItem('criticalnotify', this.criticalBillno);
        if (this.criticalOrderStatus === 'true') {
          this.change = 'true';
          localStorage.setItem('change', this.change);
        }
        this.notificationToBeOpened = '3';
        localStorage.setItem(
          'notificationToBeOpened',
          this.notificationToBeOpened
        );
      }
      this.criticalOrderRemove = this.criticalOrderRemove.concat(
        this.criticalOrderFilter
      );
    }
  }

  packedOrderFun() {
    this.packedLen = localStorage.getItem('packedLength');
    for (let i = 0; i < this.packedNotification.length - this.packedLen; i++) {
      this.packedFilteredArray[i] = this.packedNotification[i];
      this.date = new Date(this.packedFilteredArray[i].timestamp);
      this.formatDate =
        ('0' + this.date.getDate()).slice(-2) +
        '/' +
        ('0' + (this.date.getMonth() + 1)).slice(-2) +
        '/' +
        this.date.getFullYear();
      this.time = new Date(this.packedFilteredArray[i].timestamp);
      this.actualTime = this.time.toLocaleTimeString();
      this.newOrderTime.push(this.actualTime);
      this.newOrderDate.push(this.formatDate);
    }
    // this.packedFilteredArray = this.packedOrderFilter.filter(
    //   (x) => this.packedOrderRemove.indexOf(x) < 0
    // );
    // this.packedOrders = this.packedFilteredArray.length;
    // this.packedBillno = localStorage.getItem('packednotify');
    // if (this.packedFilteredArray.length > 0) {
    //   if (this.packedBillno !== this.packedFilteredArray[0].bill_no) {
    //     this.packedBillno = this.packedFilteredArray[0].bill_no;
    //     localStorage.setItem('packednotify', this.packedBillno);
    //     if (this.packedOrderStatus === 'true') {
    //       this.change = 'true';
    //       localStorage.setItem('change', this.change);
    //     }
    //     this.notificationToBeOpened = '4';
    //     localStorage.setItem(
    //       'notificationToBeOpened',
    //       this.notificationToBeOpened
    //     );
    //   }
    //   this.packedOrderRemove = this.packedOrderRemove.concat(
    //     this.packedOrderFilter
    //   );
    // }
  }

  dispatchedFun() {
    this.dispatchLen = localStorage.getItem('dispatchedLength');
    for (let i = 0; i < this.dispatchedNotification.length - this.dispatchLen; i++) {
      this.dispatchedFilteredArray[i] = this.dispatchedNotification[i];
      this.date = new Date(this.dispatchedFilteredArray[i].timestamp);
      this.formatDate =
        ('0' + this.date.getDate()).slice(-2) +
        '/' +
        ('0' + (this.date.getMonth() + 1)).slice(-2) +
        '/' +
        this.date.getFullYear();
      this.time = new Date(this.dispatchedFilteredArray[i].timestamp);
      this.actualTime = this.time.toLocaleTimeString();
      this.newOrderTime.push(this.actualTime);
      this.newOrderDate.push(this.formatDate);
    }
    // this.dispatchedFilteredArray = this.dispatchedOrderFilter.filter(
    //   (x) => this.dispatchedOrderRemove.indexOf(x) < 0
    // );
    // this.dispatchedOrders = this.dispatchedFilteredArray.length;
    // this.dispatchedBillno = localStorage.getItem('dispatchednotify');
    // if (this.dispatchedFilteredArray.length > 0) {
    //   if (this.dispatchedBillno !== this.dispatchedFilteredArray[0].bill_no) {
    //     this.dispatchedBillno = this.dispatchedFilteredArray[0].bill_no;
    //     localStorage.setItem('dispatchednotify', this.dispatchedBillno);
    //     if (this.dispatchedOrderStatus === 'true') {
    //       this.change = 'true';
    //       localStorage.setItem('change', this.change);
    //     }
    //     this.notificationToBeOpened = '5';
    //     localStorage.setItem(
    //       'notificationToBeOpened',
    //       this.notificationToBeOpened
    //     );
    //   }
    //   this.dispatchedOrderRemove = this.dispatchedOrderRemove.concat(
    //     this.dispatchedOrderFilter
    //   );
    // }
  }
  onReq() {
    this.invite = !this.invite;
    if (this.invite === true) {
      this.new_ = false;
      this.critical = false;
      this.cancel = false;
      this.dispatch = false;
      this.packed = false;
    }
  }
  onNew() {
    this.new_ = !this.new_;
    if (this.new_ === true) {
      this.critical = false;
      this.cancel = false;
      this.dispatch = false;
      this.packed = false;
      this.invite = false;
    }
  }
  onCritical() {
    this.critical = !this.critical;
    if (this.critical === true) {
      this.cancel = false;
      this.dispatch = false;
      this.packed = false;
      this.invite = false;
      this.new_ = false;
    }
  }
  onCancel() {
    this.cancel = !this.cancel;
    if (this.cancel === true) {
      this.dispatch = false;
      this.packed = false;
      this.invite = false;
      this.new_ = false;
      this.critical = false;
    }
  }
  onDispatch() {
    this.dispatch = !this.dispatch;
    if (this.dispatch === true) {
      this.packed = false;
      this.invite = false;
      this.new_ = false;
      this.critical = false;
      this.cancel = false;
    }
  }
  onPacked() {
    this.packed = !this.packed;
    if (this.packed === true) {
      this.invite = false;
      this.new_ = false;
      this.critical = false;
      this.cancel = false;
      this.dispatch = false;
    }
  }
  ngOnDestroy(): void {
    localStorage.setItem('newLength', this.orderedNotification.length);
    localStorage.setItem('cancelLength', this.cancelNotification.length);
    localStorage.setItem('packedLength', this.packedNotification.length);
    localStorage.setItem('dispatchedLength', this.dispatchedNotification.length);
    localStorage.setItem('invitationLength', this.invitation.length);
  }
}
