import { Component, OnInit, Input } from "@angular/core";
import { RetailerService } from "src/app/services/retailer.service";

@Component({
  selector: "app-invite-request",
  templateUrl: "./invite-request.component.html",
  styleUrls: ["./invite-request.component.scss"],
})
export class InviteRequestComponent implements OnInit {
  constructor(private retailerService: RetailerService) {}

  @Input() inviteRequest;

  ngOnInit() {}

  approveInviteRequest() {
    let data = { requestId: this.inviteRequest.id, approved: true };
    // console.log(this.inviteRequest);
    this.retailerService.inviteRequestResponse(data).subscribe((result) => {
      console.log("A",result);
      alert("Request Approved");
    });
  }
}
