import { DialogComponent } from "./../../components/dialog/dialog.component";
import { Status } from "./../../models/models";
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  Input,
  OnChanges,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { TransactionService } from "./../../services/transaction.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";

interface StatusMenu {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-recent-orders",
  templateUrl: "./recent-orders.component.html",
  styleUrls: ["./recent-orders.component.scss"],
})
export class RecentOrdersComponent implements OnInit, OnChanges {
  @Input("tableData") tableData: any;

  displayedColumns: string[] = [
    "customer_name",
    "retailer_name",
    "customer_phone",
    "status",
    "price",
    "remaining_time",
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // allTransactions: any;
  filterData: string;

  selectedValue: string;
  status: StatusMenu[] = [
    { value: Status.CANCELLED, viewValue: Status.CANCELLED },
    { value: Status.DELIVERED, viewValue: Status.DELIVERED },
    { value: Status.DISPATCHED, viewValue: Status.DISPATCHED },
    { value: Status.ORDERED, viewValue: Status.ORDERED },
    { value: Status.PACKED, viewValue: Status.PACKED },
  ];
  deliveryTime: any;
  timeDiff: any;
  currentTime: any;
  timeDiffMins: any;
  timeDiffHours: number;
  oldStatus: any;

  constructor(
    public dialog: MatDialog,
    private transactionService: TransactionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.tableData.length) {
      this.oldStatus = this.tableData[0].status;
    }
    this.showTableData();
  }

  // show table data
  showTableData() {
    this.currentTime = new Date();

    this.tableData.forEach((element) => {
      if (
        element.remaining_time < 0 ||
        element.status == "Delivered" ||
        element.status == "Cancelled" ||
        element.remaining_time === "-"
      ) {
        element.remaining_time = "-";
      } else {
        element.timestamp = new Date(element.timestamp);
        this.deliveryTime = new Date(
          element.timestamp.getTime() + 2 * 60 * 60 * 1000
        );
        this.timeDiff = this.deliveryTime - this.currentTime;
        this.timeDiff = this.timeDiff / 1000 / 60 / 60;
        this.timeDiff = this.timeDiff.toFixed(2);

        this.timeDiffMins = ((this.timeDiff * 100) % 100) / 100;
        this.timeDiffMins = this.timeDiffMins * 60;

        this.timeDiffHours = Math.trunc(this.timeDiff);

        element.remaining_time =
          this.timeDiffHours.toFixed(0) +
          " hours " +
          this.timeDiffMins.toFixed(0) +
          " mins ";
      }
    });

    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngOnChanges() {
    this.showTableData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onStatusChange(event: any, row: any) {
    this.openDialog(event, row);
  }

  getStatusToKeyMap(status: string) {
    switch (status) {
      case "Delivered":
        return 3;
      case "Packed":
        return 1;
      case "Dispatched":
        return 2;
      case "Cancelled":
        return 4;
      case "Ordered":
        return 0;
    }
  }

  openDialog(event: any, row: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "300px",
      data: { statusValue: event.value, row },
    });

    dialogRef.afterClosed().subscribe((result) => {
      event.source.value = this.oldStatus;
      if (result) {
        this.transactionService
          .updateOrderStatus(
            result.data.row.id,
            this.getStatusToKeyMap(result.data.statusValue)
          )
          .subscribe(
            (res) => {
              result.data.row.status = result.data.statusValue;
              this.snackBar.open("Status Updated", "", {
                duration: 5000,
              });
              this.router
                .navigateByUrl("/login", { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(["/dashboard"]);
                });
            },
            (error) => {
              this.router
                .navigateByUrl("/login", { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(["/dashboard"]);
                });
              this.snackBar.open("Could not perform this Operation", "", {
                duration: 5000,
              });
            }
          );
      }
    });
  }
}
