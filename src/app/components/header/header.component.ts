import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { NotificationComponent} from './../notification/notification.component';
import { ResetPassComponent } from './../reset-pass/reset-pass.component';
import { TransactionService } from './../../services/transaction.service';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  animal: string;
  name: string;
  change: any;
  notification = [];
  constructor(private router: Router,
              public dialog: MatDialog,
              private transactionService: TransactionService) { }

  ngOnInit() {
    this.change = localStorage.getItem('change');
    this.repeat();

  }
  repeat() {
    setInterval( () => {
      this.change = localStorage.getItem('change');
    }, 3000);
  }
  getAllNotifications() {
    setInterval ( () => {
      this.transactionService.observeOrders.subscribe((data) => {
        this.notification = data;
        for (let i = 0 ; i < this.notification.length ; i++ ) {
          // tslint:disable-next-line: radix
          if ((this.notification[i].status_change.getTime() - parseInt(localStorage.getItem('previousVisited')))
              > 0 && this.notification[i].status !== 'Ordered' && this.notification[i].is_read !== true) {
            this.change = true;
            localStorage.setItem('change', this.change);
            break;
          }
        }
      });
    }, 60000);
  }
  logout() {
    localStorage.clear();
    // window.location.reload();
    this.router.navigate(['/login']);
  }
  notifications() {
    this.router.navigate(['/notifications']);
  }
  feedbacks() {
    this.router.navigate(['/feedbacks']);
  }
  ResetPass() {
    const dialogRef = this.dialog.open(ResetPassComponent, {
      width: '450px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }
  NotifySetting(): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '450px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }
}
