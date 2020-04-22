import { DialogComponent } from "./../../components/dialog/dialog.component";
import { Orders } from "./../../constants/mockup-data";
import { Status } from "./../../models/models";
import { Component, OnInit, ViewChild, Inject, Input } from "@angular/core";
import { InteractionService } from "src/app/services/interaction.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { TransactionService } from "./../../services/transaction.service";
import { Router } from "@angular/router";

// export interface Order {
//   consumer: string;
//   shop: string;
//   phone: number;
//   status: any;
//   total: number;
//   time_left: string;
// }

interface StatusMenu {
  value: string;
  viewValue: string;
}

// const ELEMENT_DATA: Order[] = Orders;

@Component({
  selector: "app-recent-orders",
  templateUrl: "./recent-orders.component.html",
  styleUrls: ["./recent-orders.component.scss"],
})
export class RecentOrdersComponent implements OnInit {
  @Input("tableData") tableData: any;
  isSidePanelExpanded: boolean;

  displayedColumns: string[] = [
    "consumer",
    "shop",
    "phone",
    "status",
    "total",
    "time_left",
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  allTransactions: any;
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
  timeDiffHours: Number;

  constructor(
    private interaction: InteractionService,
    public dialog: MatDialog,
    private transactionService: TransactionService,
    private router: Router
  ) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  ngOnInit() {
    this.interaction.expandedStatus$.subscribe((res) => {
      this.isSidePanelExpanded = res;
    });
    this.currentTime = new Date();

    this.allTransactions = this.tableData.reverse();
    this.allTransactions.forEach((element) => {
      if (element.remaining_time < 0) {
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
    this.allTransactions = new MatTableDataSource(this.allTransactions);
    this.allTransactions.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue)
      this.allTransactions.filter = filterValue.trim().toLowerCase();
  }
  onStatusChange(event: any, row: any) {
    this.openDialog(event.value, row);
  }

  getStatusToKeyMap(status: string) {
    switch (status) {
      case "Delivered":
        return 3;
        break;
      case "Packed":
        return 1;
        break;
      case "Dispatched":
        return 2;
        break;
      case "Cancelled":
        return 4;
        break;
      case "Ordered":
        return 0;
        break;
    }
  }

  openDialog(status: any, row: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "300px",
      data: { statusValue: status, row: row },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("A",result)
      if (result) {
        this.transactionService
        .updateOrderStatus(
          result.data.row.id,
          this.getStatusToKeyMap(result.data.statusValue)
          )
          .subscribe((res) => {
            console.log("B",res)
            this.router
            .navigateByUrl("/login", { skipLocationChange: true })
            .then(() => {
                console.log("C")
                this.router.navigate(["/dashboard"]);
              });
          });
      }
    });
  }
}
