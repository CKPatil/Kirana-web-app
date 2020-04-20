import { Component } from "@angular/core";
import { navOptions } from "./constants/constants";
import { Router } from "@angular/router";
import { InteractionService } from "./services/interaction.service";
import { TransactionService } from "./services/transaction.service";
import { RetailerService } from "./services/retailer.service";
import { NotificationsPageComponent } from "./pages/notifications-page/notifications-page.component";

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

    this.transitionService.getOrdersFromServer();
    this.rertailerService.getAllInvitationRequestsFromServer();

    this.notificationsPageComponent.ngOnInit();

    setInterval(() => {
      this.rertailerService.getAllInvitationRequestsFromServer();
      this.transitionService.getOrdersFromServer();
    }, 60000);
  }

  routerEventsTrigger() {
    this.router.events.subscribe((event) => {
      if (window.location.href.indexOf("login") > -1) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
      }
    });
  }

  expandSidePanel(expanded: boolean) {
    this.isExpanded = expanded;
    this.interaction.setExpandStatus(this.isExpanded);
  }
}
