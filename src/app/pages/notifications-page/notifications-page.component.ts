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
  criticalOrder: any = [];
  criticalOrderFilter: any = [];
  notifications: any[];
  newStatus = 'Ordered';
  cancelledStatus = 'Cancelled';
  packedStatus = 'Packed';
  dispatchedStatus = 'Dispatched';
  orderedNotifications: any = [];
  cancelNotifications: any = [];
  packedNotifications: any = [];
  dispatchedNotifications: any = [];
  newOrderedStatus: any;
  cancelOrderedStatus: any;
  packedOrderedStatus: any;
  dispatchedOrderedStatus: any;
  date: any;
  actualTime: any;
  time: any;
  formatDate: any;
  newOrderTime = [];
  cancelOrderTime = [];
  criticalOrderTime = [];
  packedOrderTime = [];
  dispatchedOrderTime = [];
  criticalDelivery = ['Cancelled', 'Delivered'];
  criticalOrderRemove = [];
  myNewOrder = [];
  criticalOrderSet: any;
  criticalOrderDateSet: any;
  criticalOrderTimeSet: any;
  criticalFilteredArray = [];
  notifylen: number;
  newOrderDate = [];
  cancelOrderDate = [];
  criticalOrderDate = [];
  packedOrderDate = [];
  dispatchedOrderDate = [];
  criticalOrders: number;
  pos = true;
  change = 'false';
  criticalBillno: any;
  deliveryTime: any;
  invitations: any[] = [];
  invitationStatus: any;
  inviteStatus: any;
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
  initial: any;
  newInvitationId = '0';
  ph_no: any;
  allnotify = false;
  isNew = false;
  isCancel = false;
  isPacked = false;
  isDispatch = false;
  today = new Date();
  formattedTodayDate =
    ('0' + this.today.getDate()).slice(-2) +
    '/' +
    ('0' + (this.today.getMonth() + 1)).slice(-2) +
    '/' +
    this.today.getFullYear();

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
    if (this.newOrderStatus == 'false' && this.cancelOrderStatus == 'false' && this.criticalOrderStatus == 'false' &&
      this.inviteStatus == 'false' && this.packedOrderStatus == 'false' && this.dispatchedOrderStatus == 'false') {
        this.allnotify = true;
      }
    this.transactionService.observeOrders.subscribe((data) => {
      this.notifications = data;
      this.newOrderedStatus = { records: this.notifications };
      this.orderedNotifications = this.newOrderedStatus.records.filter(
        (i: { status: string }) => this.newStatus.includes(i.status)
      );
      this.cancelOrderedStatus = { records: this.notifications };
      this.cancelNotifications = this.cancelOrderedStatus.records.filter(
        (i: { status: string }) => this.cancelledStatus.includes(i.status)
      );
      this.packedOrderedStatus = { records: this.notifications };
      this.packedNotifications = this.packedOrderedStatus.records.filter(
        (i: { status: string }) => this.packedStatus.includes(i.status)
      );
      this.dispatchedOrderedStatus = { records: this.notifications };
      this.dispatchedNotifications = this.dispatchedOrderedStatus.records.filter(
        (i: { status: string }) => this.dispatchedStatus.includes(i.status)
      );
      this.newOrderFun();
      this.cancelOrderFun();
      this.criticalOrderFun();
      this.packedOrderFun();
      this.dispatchedFun();
    });

    this.retailerService.observeInviteRequests.subscribe((data) => {
      this.invitations = data;
      if (this.inviteStatus === 'true') {
        if (this.invitations.length > 0) {
          this.newInvitationId = localStorage.getItem('newRequestId');
          this.ph_no = this.invitations[0].ph_no;
          if (this.newInvitationId != this.ph_no) {
            this.change = 'true';
            localStorage.setItem('change', this.change);
            this.newInvitationId = this.invitations[0].ph_no;
            localStorage.setItem('newRequestId', this.newInvitationId);
          }
        }
      }
    });
  }

  newOrderFun() {
    this.newLen = 0;
    for (let i = 0; i < this.orderedNotifications.length; i++) {
      if (this.orderedNotifications[i].is_read === false) {
        this.newLen++;
      }
      this.date = new Date(this.orderedNotifications[i].timestamp);
      this.formatDate =
        ('0' + this.date.getDate()).slice(-2) +
        '/' +
        ('0' + (this.date.getMonth() + 1)).slice(-2) +
        '/' +
        this.date.getFullYear();
      this.time = new Date(this.orderedNotifications[i].timestamp);
      this.actualTime = this.time.toLocaleTimeString();
      this.newOrderTime.push(this.actualTime);
      this.newOrderDate.push(this.formatDate);
    }
  }

  cancelOrderFun() {
    this.cancelLen = 0;
    for (let i = 0; i < this.cancelNotifications.length; i++) {
      if (this.cancelNotifications[i].is_read === false) {
        this.cancelLen++;
      }
      this.date = new Date(this.cancelNotifications[i].timestamp);
      this.formatDate =
        ('0' + this.date.getDate()).slice(-2) +
        '/' +
        ('0' + (this.date.getMonth() + 1)).slice(-2) +
        '/' +
        this.date.getFullYear();
      this.time = new Date(this.cancelNotifications[i].timestamp);
      this.actualTime = this.time.toLocaleTimeString();
      this.cancelOrderTime.push(this.actualTime);
      this.cancelOrderDate.push(this.formatDate);
    }
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
      if ((this.criticalBillno !== this.criticalFilteredArray[0].bill_no) && this.criticalOrderStatus === 'true') {
        this.criticalBillno = this.criticalFilteredArray[0].bill_no;
        localStorage.setItem('criticalnotify', this.criticalBillno);
        if (this.criticalOrderStatus === 'true') {
          this.change = 'true';
          localStorage.setItem('change', this.change);
        }
      }
      this.criticalOrderRemove = this.criticalOrderRemove.concat(
        this.criticalOrderFilter
      );
    }
  }

  packedOrderFun() {
    this.packedLen = 0;
    for (let i = 0; i < this.packedNotifications.length ; i++) {
      if (this.packedNotifications[i].is_read === false) {
        this.packedLen++;
      }
      this.date = new Date(this.packedNotifications[i].timestamp);
      this.formatDate =
        ('0' + this.date.getDate()).slice(-2) +
        '/' +
        ('0' + (this.date.getMonth() + 1)).slice(-2) +
        '/' +
        this.date.getFullYear();
      this.time = new Date(this.packedNotifications[i].timestamp);
      this.actualTime = this.time.toLocaleTimeString();
      this.packedOrderTime.push(this.actualTime);
      this.packedOrderDate.push(this.formatDate);
    }
  }

  dispatchedFun() {
    this.dispatchLen = 0;
    for (let i = 0; i < this.dispatchedNotifications.length; i++) {
      if (this.dispatchedNotifications[i].is_read === false) {
        this.dispatchLen++;
      }
      this.date = new Date(this.dispatchedNotifications[i].timestamp);
      this.formatDate =
        ('0' + this.date.getDate()).slice(-2) +
        '/' +
        ('0' + (this.date.getMonth() + 1)).slice(-2) +
        '/' +
        this.date.getFullYear();
      this.time = new Date(this.dispatchedNotifications[i].timestamp);
      this.actualTime = this.time.toLocaleTimeString();
      this.dispatchedOrderTime.push(this.actualTime);
      this.dispatchedOrderDate.push(this.formatDate);
    }
  }
  onClick(orderId) {
    this.transactionService.readNotification(orderId)
      .subscribe( (res) => {
        console.log(res);
      });
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
    this.isNew = true;
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
    this.isCancel = true;
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
    this.isDispatch = true;
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
    this.isDispatch = true;
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
    this.change = 'false';
    localStorage.setItem('change', this.change);
  }
}
