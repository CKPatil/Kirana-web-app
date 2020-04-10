import { Component, OnInit, Input, Inject } from "@angular/core";
import { RetailerService } from "src/app/services/retailer.service";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";

@Component({
  selector: "app-invite-request",
  templateUrl: "./invite-request.component.html",
  styleUrls: ["./invite-request.component.scss"],
})
export class InviteRequestComponent implements OnInit {
  constructor(
    private retailerService: RetailerService,
    public dialog: MatDialog
  ) {}

  @Input() inviteRequest;

  ngOnInit() {}

  approveInviteRequest() {
    let data = { requestId: this.inviteRequest.id, approved: true };
    this.retailerService.inviteRequestResponse(data).subscribe((result) => {
      alert("Request Approved");
    });
  }

  rejectInviteRequest() {
    let data = { requestId: this.inviteRequest.id, approved: false };
    this.retailerService.inviteRequestResponse(data).subscribe((result) => {
      alert("Request Rejected");
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ShowInviteDetailModal, {
      width: "350px",
      data: this.inviteRequest,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.approveInviteRequest();
      }
    });
  }
}

@Component({
  selector: "show-invite-detail-dialogue",
  templateUrl: "./showInviteDetailModal.html",
})
export class ShowInviteDetailModal {
  constructor(
    public dialogRef: MatDialogRef<ShowInviteDetailModal>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
