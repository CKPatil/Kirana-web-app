import { Component, Inject, Input } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TransactionService } from "src/app/services/transaction.service";

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
    private router: Router
  ) {}

  // for changing the status
  openChooseOrderStatusDialog() {
    const dialogRef = this.dialog.open(ChooseOrderStatusDialog, {
      width: "20em",
      data: this.item.status,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.transactionService
          .updateOrderStatus(this.item.id, result)
          .subscribe(
            (res) => {
              alert("Order Status Updated");
              this.router
                .navigateByUrl("/login", { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(["/transactions"]);
                });
            },
            (err) => {
              alert("Error Occured in Updating Status");
            }
          );
      }
    });
  }
}

// //////////// Select the StatusDialog
@Component({
  selector: "chooseOrderStatusDialog",
  templateUrl: "chooseOrderStatusDialog.html",
})
export class ChooseOrderStatusDialog {
  constructor(
    public dialogRef: MatDialogRef<ChooseOrderStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedValue = this.status.indexOf(this.data);
  }
  status = ["Ordered", "Packed", "Dispatched", "Delivered", "Cancelled"];
  selectedValue;
  onNoClick(): void {
    this.dialogRef.close();
  }
}
