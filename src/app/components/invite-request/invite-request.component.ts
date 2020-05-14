import { Component, OnInit, Input, Inject } from '@angular/core';
import { RetailerService } from '../../../app/services/retailer.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'show-invite-detail-dialogue',
  templateUrl: './showInviteDetailModal.html',
})
export class ShowInviteDetailModal {
  constructor(
    public dialogRef: MatDialogRef<ShowInviteDetailModal>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'app-invite-request',
  templateUrl: './invite-request.component.html',
  styleUrls: ['./invite-request.component.scss'],
})
export class InviteRequestComponent implements OnInit {
  constructor(
    private retailerService: RetailerService,
    public dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  @Input() inviteRequest;

  ngOnInit() { }

  // Actions to be done after approving the invite request
  approveInviteRequest() {
    const data = { requestId: this.inviteRequest.id, approved: true };
    this.retailerService.inviteRequestResponse(data).subscribe((result) => {
      this.snackbar.open('Request Approved', '', {
        duration: 2000,
      });
      this.router
        .navigateByUrl('/login', { skipLocationChange: true })
        .then(() => {
          this.router.navigate(['/dashboard']);
        });
    });
  }

  // Actions to be done after rejecting the invite request
  rejectInviteRequest() {
    const data = { requestId: this.inviteRequest.id, approved: false };
    this.retailerService.inviteRequestResponse(data).subscribe((result) => {
      this.snackbar.open('Request Rejected', '', {
        duration: 2000,
      });
      this.router
        .navigateByUrl('/login', { skipLocationChange: true })
        .then(() => {
          this.router.navigate(['/dashboard']);
        });
    });
  }

  // Open details of reatiler modal
  openDialog() {
    const dialogRef = this.dialog.open(ShowInviteDetailModal, {
      width: '90%',
      maxWidth: '450px',
      data: this.inviteRequest,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.approveInviteRequest();
      } else if (result == false) {
        this.rejectInviteRequest();
      }
    });
  }
}

