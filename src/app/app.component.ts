import { Component } from "@angular/core";
import { navOptions } from "./constants/constants";
import { Router } from "@angular/router";
import { InteractionService } from "./services/interaction.service";
import { TransactionService } from "./services/transaction.service";
import { RetailerService } from "./services/retailer.service";
import { NotificationsPageComponent } from "./pages/notifications-page/notifications-page.component";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [NotificationsPageComponent],
})
export class AppComponent {
  title = "kirana-web-app";
  isExpanded: boolean;
  isLogin: boolean;
  navBarOptions: any;

  constructor(
    private router: Router,
    private interaction: InteractionService,
    private transitionService: TransactionService,
    private rertailerService: RetailerService,
    private notificationsPageComponent: NotificationsPageComponent
  ) {
    this.navBarOptions = navOptions.admin_panel;
    this.routerEventsTrigger();

    this.isLoginObserver = new BehaviorSubject(this.isLogin);

    this.isLoginObserver.subscribe((result) => {
      if (!result) {
        this.isRefreshActive = true;
        clearInterval(this.refreshInterval);
      }
      if (result) {
        if (this.isRefreshActive && this.router.url.indexOf("login") === -1) {
          this.isRefreshActive = false;
          this.startGettingData();
        }
      }
    });
  }

  isRefreshActive = false;
  eventChange() {
    this.isLoginObserver.next(this.isLogin);
  }

  isLoginObserver;
  refreshInterval;

  startGettingData() {
    this.transitionService.getOrdersFromServer();
    this.rertailerService.getAllInvitationRequestsFromServer();

    this.notificationsPageComponent.ngOnInit();

    this.refreshInterval = setInterval(() => {
      console.log("Refreshing...");
      this.rertailerService.getAllInvitationRequestsFromServer();
      this.transitionService.getOrdersFromServer();
    }, 60000);
  }

  routerEventsTrigger() {
    this.router.events.subscribe((event) => {
      if (window.location.href.indexOf("login") > -1) {
        this.isLogin = false;
        this.eventChange();
      } else {
        this.isLogin = true;
        this.eventChange();
      }
    });
  }

  expandSidePanel(expanded: boolean) {
    this.isExpanded = expanded;
    this.interaction.setExpandStatus(this.isExpanded);
  }
}
