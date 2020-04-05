import { Component, OnInit } from "@angular/core";
import { InteractionService } from "src/app/services/interaction.service";
import { analytics } from "./../../constants/mockup-data";
import { RetailerService } from "./../../services/retailer.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  isSidePanelExpanded: boolean;
  analytics: { name: string; count: number }[];

  inviteRequests: any;

  constructor(
    private interaction: InteractionService,
    private retailerService: RetailerService
  ) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  ngOnInit() {
    this.analytics = analytics;
    this.interaction.expandedStatus$.subscribe((res) => {
      this.isSidePanelExpanded = res;
    });

    this.retailerService.getAllRetailers().subscribe((result) => {
      console.log("AAA", result.body);
      this.inviteRequests = result.body;
    });
  }
}
