import { Router } from "@angular/router";
import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { NotificationComponent } from "./../notification/notification.component";
import { ResetPassComponent } from "./../reset-pass/reset-pass.component";
import { TransactionService } from "./../../services/transaction.service";
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  animal: string;
  name: string;
  change: any;
  notification = [];
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.change = localStorage.getItem("change");
    this.repeat();
    this.getAllNotifications();
  }

  // To see if new notification have occured in order to change icon
  repeat() {
    setInterval(() => {
      this.change = localStorage.getItem("change");
    }, 3000);
  }

  // Check for new notifications
  getAllNotifications() {
    setInterval(() => {
      this.transactionService.observeOrders.subscribe((data) => {
        this.notification = data;
        for (let i = 0; i < this.notification.length; i++) {
          if (
            new Date(this.notification[i].status_change).getTime() -
              parseInt(localStorage.getItem("previousVisited"), 10) >
              0 &&
            this.notification[i].status !== "Delivered" &&
            this.notification[i].is_read !== true
          ) {
            switch (this.notification[i].status) {
              case "Ordered":
                if (localStorage.getItem("newOrder") === "true") {
                  localStorage.setItem("change", "true");
                }
                break;
              case "Cancelled":
                if (localStorage.getItem("cancelOrder") === "true") {
                  localStorage.setItem("change", "true");
                }
                break;
              case "Packed":
                if (localStorage.getItem("packedOrder") === "true") {
                  localStorage.setItem("change", "true");
                }
                break;
              case "Dispatched":
                if (localStorage.getItem("dispatchedOrder") === "true") {
                  localStorage.setItem("change", "true");
                }
                break;
              default:
                localStorage.setItem("change", "false");
                break;
            }
            break;
          }
        }
      });
    }, 60000);
  }

  // clicking on logout icon
  logout() {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  // clicking on notifications icon
  notifications() {
    this.router.navigate(["/notifications"]);
  }

  // clicking on feedback icon
  feedbacks() {
    this.router.navigate(["/feedbacks"]);
  }

  // clicking on settings icon
  ResetPass() {
    const dialogRef = this.dialog.open(ResetPassComponent, {
      width: "450px",
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.animal = result;
    });
  }
  NotifySetting(): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: "450px",
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.animal = result;
    });
  }
}
