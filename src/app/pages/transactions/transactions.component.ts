import { Component, OnInit, OnDestroy } from "@angular/core";
import { InteractionService } from "src/app/services/interaction.service";
import { TransactionService } from "src/app/services/transaction.service";
import { FormControl } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.scss"],
})
export class TransactionsComponent implements OnInit, OnDestroy {
  pageEvent: PageEvent;
  pageSize = 25;
  pageSizeOptions: number[] = [25, 50, 100];
  length;

  searchRetail: any;
  searchStatus: any;
  searchDate: any;

  retailers = [];

  status = ["Ordered", "Packed", "Dispatched", "Delivered", "Cancelled"];

  isSidePanelExpanded: boolean;

  allTransaction: any = [];
  removeDuplicate: string[] = [];
  temp = "";

  retailerControl = new FormControl();
  statusControl = new FormControl();
  dateControl = new FormControl();

  date: Date[] = [];
  orderDate: string[] = [];

  retailerFilteredOptions: Observable<string[]>;
  statusFilteredOptions: Observable<string[]>;

  private _retailerfilter(value: string): string[] {
    const retailerFilterValue = value.toLocaleLowerCase();
    return this.retailers.filter((retailer) =>
      retailer.toLocaleLowerCase().includes(retailerFilterValue)
    );
  }

  private _statusFilter(value: string): string[] {
    const statusFilterValue = value.toLowerCase();
    return this.status.filter((state) =>
      state.toLowerCase().includes(statusFilterValue)
    );
  }

  constructor(
    private interaction: InteractionService,
    private transactionService: TransactionService
  ) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  refresh;

  ngOnInit() {
    this.interaction.expandedStatus$.subscribe((res) => {
      this.isSidePanelExpanded = res;
    });
    this.getTransactionHistory();

    this.refresh = setInterval(() => {
      this.getTransactionHistory();
    }, 60000);
  }

  // to clear the refresh interval
  ngOnDestroy() {
    clearInterval(this.refresh);
  }

  dateChanged(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.searchDate = this.parseDate(event.value);
    } else {
      this.searchDate = "";
    }
  }

  getTransactionHistory() {
    this.transactionService.getAllOrders().subscribe((res) => {
      this.allTransaction = res;
      this.allTransaction.reverse();

      this.pageEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: this.allTransaction.length,
      };
      this.length = this.allTransaction.length;

      for (let i = 0; i < this.allTransaction.length; i++) {
        this.allTransaction[i].orderDate = this.parseDate(
          this.allTransaction[i].timestamp
        );
      }
      for (let i = 0; i < this.allTransaction.length; i++) {
        this.removeDuplicate.push(this.allTransaction[i].vendor_name);
      }

      this.removeDuplicate.sort();

      for (let i = 0; i < this.removeDuplicate.length; i++) {
        if (this.removeDuplicate[i] !== this.temp) {
          this.retailers.push(this.removeDuplicate[i]);
          this.temp = this.removeDuplicate[i];
        }
      }

      this.statusFilteredOptions = this.statusControl.valueChanges.pipe(
        startWith(""),
        map((value) => this._statusFilter(value))
      );
      this.retailerFilteredOptions = this.retailerControl.valueChanges.pipe(
        startWith(""),
        map((value) => this._retailerfilter(value))
      );
    });
  }

  setStatusColor(status: any) {
    return status;
  }

  onReset() {
    this.statusControl.setValue("");
    this.retailerControl.setValue("");
    this.dateControl.setValue("");
    this.searchDate = "";
  }

  parseDate = (d) => {
    d = new Date(d);
    let date = d.getDate();
    date = ("" + date).length === 1 ? "" + 0 + date : date;
    let month = d.getMonth();
    month = ("" + (month + 1)).length === 1 ? "" + 0 + (month + 1) : month + 1;
    const year = d.getFullYear();
    return `${date}/${month}/${year}`;
  };

  trackByOrderId(index, item){
    return item.id
  }
}
