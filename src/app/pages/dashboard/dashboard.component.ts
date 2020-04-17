import { NotificationsPageComponent } from "./../notifications-page/notifications-page.component";
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
  providers: [NotificationsPageComponent],
})
export class DashboardComponent implements OnInit, OnDestroy {
  isSidePanelExpanded: boolean;
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

  constructor(
    private interaction: InteractionService,
    private transactionService: TransactionService,
    private retailerService: RetailerService,
    private notificationsPageComponent: NotificationsPageComponent
  ) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  // to get the invitaition request from the server
  getInvitations() {
    this.retailerService.getAllInvitationRequests().subscribe((result) => {
      this.inviteRequests = result.body;
    });
  }
  refresh1;

  ngOnInit() {
    this.notificationsPageComponent.ngOnInit();
    this.analytics = analytics;
    this.interaction.expandedStatus$.subscribe((res) => {
      this.isSidePanelExpanded = res;
    });

    this.getInvitations();

    this.refresh = setInterval(() => {
      this.getInvitations();
    }, 60000);

    this.analytics[0].count = 0;
    this.analytics[1].count = 0;
    this.analytics[2].count = 0;
    this.analytics[3].count = 0;
    this.analytics[4].count = 0;

    this.currentDate = new Date();
    this.transactionService.buildURLS();
    this.transactionService.getAllOrders().subscribe((res: any) => {
      this.allTransactions = res;
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
        if(element.status=='Dispatched'){
          this.dispatchedOrders.push(element);
        }
        if(element.status=="Delivered"){
          this.deliveredOrders.push(element);
        }
        if(element.status=="Cancelled"){
          this.cancelledOrders.push(element);
        }

        //console.log(this.dispatchedOrders);
        //console.log(this.allTransactions);
      });

      this.allTransactions.forEach((element) => {
        if (element.status == "Ordered") {
          this.analytics[1].count++;
        } else if (element.status == "Packed") {
          this.analytics[2].count++;
        } else if (element.status == "Delivered") {
          this.analytics[3].count++;
        } else if (element.remaining_time <= 30 && element.remaining_time > 0) {
          this.analytics[0].count++;
        }
      });
    });
    this.retailerService.getAllRetailers().subscribe((res) => {
      this.allRetailers = res.body;
      this.allRetailers.forEach((element) => {
        this.analytics[4].count++;
      });
    });
    
    this.refresh1 = setTimeout(() => {
      this.ngOnInit();
    }, 60000);
  }
  ngOnDestroy() {
    clearTimeout(this.refresh1);
    clearInterval(this.refresh);
  }
  getTransactions(orderType: string) {}
}
