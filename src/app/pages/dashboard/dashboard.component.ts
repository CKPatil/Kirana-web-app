import { Component, OnInit, OnDestroy } from "@angular/core";
import { InteractionService } from "src/app/services/interaction.service";
import { analytics } from "./../../constants/mockup-data";
import { TransactionService } from "./../../services/transaction.service";
import { RetailerService } from "./../../services/retailer.service";

import { EmptyError } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // isSidePanelExpanded: boolean;
  analytics: { name: string; count: number }[];
  allTransactions: any;
  orderStatus = "Packed";
  orderStatusPacked: boolean;
  allOrders: any;
  currentDate: any;
  orderTime = [];
  timeDiff: any;
  deliveryTime: any;
  allRetailers: any;
  currentTime: Date;

  refresh: any;
  inviteRequests: any;
  timeDiffMins: number;

  packedOrders = [];
  criticalOrders = [];
  recentOrders = [];
  cancelledOrders = [];
  deliveredOrders = [];
  dispatchedOrders = [];

  isDataAvailable = false;

  constructor(
    // private interaction: InteractionService,
    private transactionService: TransactionService,
    private retailerService: RetailerService
  ) {
    // this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  ngOnInit() {
    // this.interaction.expandedStatus$.subscribe((res) => {
    //   this.isSidePanelExpanded = res;
    // });

    // to get the invitaition request from the observer from the service
    this.retailerService.observeInviteRequests.subscribe((result) => {
      this.inviteRequests = result;
    });

    this.analytics = analytics;

    this.currentDate = new Date();
    this.transactionService.observeOrders.subscribe((res: any) => {
      this.isDataAvailable = false;
      this.allTransactions = res;
      this.packedOrders = [];
      this.criticalOrders = [];
      this.recentOrders = [];
      this.cancelledOrders = [];
      this.deliveredOrders = [];
      this.dispatchedOrders = [];

      this.allTransactions.forEach((element) => {
        element.timestamp = new Date(element.timestamp);
        this.deliveryTime = new Date(
          element.timestamp.getTime() + 2 * 60 * 60 * 1000
        );
        this.timeDiff = this.deliveryTime - this.currentDate;
        this.timeDiff = this.timeDiff / 1000 / 60 / 60;
        this.timeDiff = this.timeDiff.toFixed(2);
        this.timeDiffMins = this.timeDiff * 60;
        element.remaining_time = +this.timeDiffMins.toFixed(0);

        if (
          element.remaining_time > 0 &&
          element.remaining_time <= 30 &&
          (element.status == "Packed" ||
            element.status == "Ordered" ||
            element.status == "Dispatched")
        ) {
          this.criticalOrders.push(element);
        }
        if (element.status == "Packed") {
          this.packedOrders.push(element);
        }
        if (element.status == "Ordered") {
          this.recentOrders.push(element);
        }
        if (element.status == "Dispatched") {
          this.dispatchedOrders.push(element);
        }
        if (element.status == "Delivered") {
          this.deliveredOrders.push(element);
        }
        if (element.status == "Cancelled") {
          this.cancelledOrders.push(element);
        }
      });

      if (this.allTransactions.length > 0) {
        this.isDataAvailable = true;
      }

      this.analytics[0].count = this.criticalOrders.length;
      this.analytics[1].count = this.recentOrders.length;
      this.analytics[2].count = this.packedOrders.length;
      this.analytics[3].count = this.deliveredOrders.length;
    });

    this.retailerService.getAllRetailers().subscribe((res) => {
      this.allRetailers = res.body;
      this.analytics[4].count = this.allRetailers.length;
    });

    this.refresh = setTimeout(() => {
      console.log('refreshing dashboard...')
      this.ngOnInit();
    }, 30000);
  }

  ngOnDestroy() {
    clearInterval(this.refresh);
  }
}
