import { SharedService } from './../../services/shared.service';
import { RetailerService } from './../../services/retailer.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  Component,
  OnInit,
  ViewChild,
  AfterContentChecked,
  Inject,
} from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

export interface Retailer {
  name: string;
  email: string;
  phone: number;
  shop: string;
  totalBusiness: number;
  recentActivity: string;
}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'blockConformationDialog',
  templateUrl: 'blockConformationDialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class BlockConformationDialog {
  constructor(
    public dialogRef: MatDialogRef<BlockConformationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./retailer.component.scss'],
})
export class RetailerComponent implements OnInit {
  isSidePanelExpanded: boolean;
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'retailer_name',
    'profit',
    'address',
    'blocked',
  ];
  allRetailers: any;
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  record: any;
  blockMsg: any;
  comp1val: string;
  comp2val: string;
  constructor(
    private interaction: InteractionService,
    private retailerService: RetailerService,
    private sharedService: SharedService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
    this.sharedService.comp1Val = '';
  }

  ngOnInit() {
    this.interaction.expandedStatus$.subscribe((res) => {
      this.isSidePanelExpanded = res;
    });
    this.retailerService.getAllRetailers().subscribe((res) => {
      this.allRetailers = res.body;
      this.dataSource = new MatTableDataSource(this.allRetailers);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    });
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterContentChecked() {
    this.comp2val = this.sharedService.comp2Val;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  openConfirmBlockDialog(vendorId, set) {
    const dialogRef = this.dialog.open(BlockConformationDialog, {
      width: '20em',
      data: set,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.retailerService.blockVendor(vendorId, set)
          .subscribe((res) => {
            this.blockMsg = res;
            // console.log(this.blockMsg);
            if (this.blockMsg.message === 'vendor blocked') {
              this.snackbar.open('Retailer blocked', '', {
                duration: 2000,
                panelClass: 'snackbar',
              });
            } else {
              this.snackbar.open('Retailer unblocked', '', {
                duration: 2000,
                panelClass: 'snackbar',
              });
            }
            this.router
              .navigateByUrl('/login', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/retailer']);
              });
          },
            (error) => {
              this.snackbar.open('Error Occured, Try after sometime.', '', {
                duration: 5000,
              });
            }
          );
      }
    });
  }

}

