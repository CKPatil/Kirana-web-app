import { Component, Inject, Input } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
// import { Router } from "@angular/router";
import { TransactionService } from "src/app/services/transaction.service";

// STATUS Array
import { STATUSES } from "./../../constants/constants";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-transactions-card",
  templateUrl: "./transactions-card.component.html",
  styleUrls: ["./transactions-card.component.scss"],
})
export class TransactionsCardComponent {
  @Input() item: any;

  constructor(
    public dialog: MatDialog,
    private transactionService: TransactionService,
    // private router: Router,
    private _snackbar: MatSnackBar
  ) {}

  // for changing the status
  openChooseOrderStatusDialog() {
    const dialogRef = this.dialog.open(ChooseOrderStatusDialog, {
      width: "20em",
      data: this.item.status,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // if (result) {
      if (result >= 0) {
        this.transactionService
          .updateOrderStatus(this.item.id, result)
          .subscribe(
            (res) => {
              this.item.status = STATUSES[result];
              this._snackbar.open("Order Status Updated", "", {
                duration: 5000,
              });
              // this.router
              //   .navigateByUrl("/login", { skipLocationChange: true })
              //   .then(() => {
              //     this.router.navigate(["/transactions"]);
              //   });
            },
            (err) => {
              this._snackbar.open("Operation can't be Performed", "", {
                duration: 5000,
              });
            }
          );
      }
    });
  }

  onenOrderInfodialog() {
    const dialogRef = this.dialog.open(OrderInfoDialog, {
      width: "40em",
      data: this.item,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}

// //////////// Select the Status Dialog
@Component({
  selector: "chooseOrderStatusDialog",
  templateUrl: "chooseOrderStatusDialog.html",
})
export class ChooseOrderStatusDialog {
  constructor(
    public dialogRef: MatDialogRef<ChooseOrderStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.statuses = STATUSES;
    this.selectedValue = STATUSES.indexOf(this.data);
  }
  statuses;
  selectedValue;

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "orderInfoDialog",
  templateUrl: "orderInfoDialog.html",
})
export class OrderInfoDialog {
  constructor(
    public dialogRef: MatDialogRef<OrderInfoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
