import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
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
  disabled = false;
  constructor(public dialogRef: MatDialogRef<NotificationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.checkedNewOrder = localStorage.getItem('newOrder');
    this.checkedCancelledStatus = localStorage.getItem('cancelOrder');
    this.checkedCriticalStatus = localStorage.getItem('criticalOrder');
  }

  newOrdersChange(newNotificationEvent) {
    localStorage.setItem('newOrder', newNotificationEvent.checked.toString());
    this.router.navigateByUrl('/login',
    {skipLocationChange: true})
    .then( () => {
      this.router.navigate(['/notifications']);
    });
    this.notificationService.sendNewOrder(newNotificationEvent.checked.toString());
  }
  CriticalStatusChange(criticalNotificationEvent) {
    localStorage.setItem('criticalOrder', criticalNotificationEvent.checked.toString());
    this.router.navigateByUrl('/login',
    {skipLocationChange: true})
    .then( () => {
      this.router.navigate(['/notifications']);
    });
    this.notificationService.sendCriticalOrder(criticalNotificationEvent.checked.toString());
  }
  CancelledStatusChange(cancelledlNotificationEvent) {
    localStorage.setItem('cancelOrder', cancelledlNotificationEvent.checked.toString());
    this.router.navigateByUrl('/login',
    {skipLocationChange: true})
    .then( () => {
      this.router.navigate(['/notifications']);
    });
    this.notificationService.sendCancelOrder(cancelledlNotificationEvent.checked.toString());
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
