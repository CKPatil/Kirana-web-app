import { Component, Inject, Input } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { TransactionService } from "src/app/services/transaction.service";
import { STATUSES } from "./../../constants/constants";
import { MatSnackBar } from "@angular/material";

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
    private snackBar: MatSnackBar
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
              this.snackBar.open("Order Status Updated", "", {
                duration: 5000,
              });
              // this.router
              //   .navigateByUrl("/login", { skipLocationChange: true })
              //   .then(() => {
              //     this.router.navigate(["/transactions"]);
              //   });
            },
            (err) => {
              this.snackBar.open("Operation can't be Performed", "", {
                duration: 5000,
              });
            }
          );
      }
    });
  }
}

