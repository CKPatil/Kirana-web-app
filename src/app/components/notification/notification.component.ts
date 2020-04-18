import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit  {

  color: ThemePalette = 'accent';
  checkedNewOrder: any = false;
  checkedCancelledStatus: any = false;
  checkedCriticalStatus: any = false;
  checkedPackedStatus: any = false;
  checkedDispatchedStatus: any = false;
  checkedInviteStatus: any = false;
  disabled = false;
  constructor(public dialogRef: MatDialogRef<NotificationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) { }

  ngOnInit(): void {
    this.checkedNewOrder = localStorage.getItem('newOrder');
    this.checkedCancelledStatus = localStorage.getItem('cancelOrder');
    this.checkedCriticalStatus = localStorage.getItem('criticalOrder');
    this.checkedPackedStatus = localStorage.getItem('packedOrder');
    this.checkedDispatchedStatus = localStorage.getItem('dispatchedOrder');
    this.checkedInviteStatus = localStorage.getItem('inviteStatus');
  }

  newOrdersChange(newNotificationEvent) {
    localStorage.setItem('newOrder', newNotificationEvent.checked.toString());
    if (this.router.url === '/notifications') {
      this.router.navigateByUrl('/login',
      {skipLocationChange: true})
      .then( () => {
        this.router.navigate(['/notifications']);
      });
    }
  }
  CriticalStatusChange(criticalNotificationEvent) {
    localStorage.setItem('criticalOrder', criticalNotificationEvent.checked.toString());
    if (this.router.url === '/notifications') {
      this.router.navigateByUrl('/login',
      {skipLocationChange: true})
      .then( () => {
        this.router.navigate(['/notifications']);
      });
    }
  }
  CancelledStatusChange(cancelledlNotificationEvent) {
    localStorage.setItem('cancelOrder', cancelledlNotificationEvent.checked.toString());
    if (this.router.url === '/notifications') {
      this.router.navigateByUrl('/login',
      {skipLocationChange: true})
      .then( () => {
        this.router.navigate(['/notifications']);
      });
    }
  }
  PackedStatusChange(packedNotificationEvent) {
    localStorage.setItem('packedOrder', packedNotificationEvent.checked.toString());
    if (this.router.url === '/notifications') {
      this.router.navigateByUrl('/login',
      {skipLocationChange: true})
      .then( () => {
        this.router.navigate(['/notifications']);
      });
    }
  }
  DispatchedStatusChange(dispatchedNotificationEvent) {
    localStorage.setItem('dispatchedOrder', dispatchedNotificationEvent.checked.toString());
    if (this.router.url === '/notifications') {
      this.router.navigateByUrl('/login',
      {skipLocationChange: true})
      .then( () => {
        this.router.navigate(['/notifications']);
      });
    }
  }
  InviteStatusChange(inviteNotificationEvent) {
    localStorage.setItem('inviteStatus', inviteNotificationEvent.checked.toString());
    if (this.router.url === '/notifications') {
      this.router.navigateByUrl('/login',
      {skipLocationChange: true})
      .then( () => {
        this.router.navigate(['/notifications']);
      });
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
