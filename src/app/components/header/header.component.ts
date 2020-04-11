import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { NotificationComponent} from './../notification/notification.component';
import { ResetPassComponent } from './../reset-pass/reset-pass.component';
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

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
  }

  logout() {
    localStorage.clear();
    window.location.reload();
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
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
  NotifySetting(): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '450px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}
