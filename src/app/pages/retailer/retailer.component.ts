import { SharedService } from "./../../services/shared.service";
import { RetailerService } from "./../../services/retailer.service";
import {
  Component,
  OnInit,
  ViewChild,
  AfterContentChecked,
} from "@angular/core";
import { InteractionService } from "src/app/services/interaction.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

export interface Retailer {
  name: string;
  email: string;
  phone: number;
  shop: string;
  totalBusiness: number;
  recentActivity: string;
}

@Component({
  selector: "app-retailer",
  templateUrl: "./retailer.component.html",
  styleUrls: ["./retailer.component.scss"],
})
export class RetailerComponent implements OnInit {
  isSidePanelExpanded: boolean;
  displayedColumns: string[] = [
    "name",
    "email",
    "phone",
    "retailer_name",
    "profit",
    "address",
  ];
  allRetailers: any;
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  record: any;
  comp1val: string;
  comp2val: string;
  constructor(
    private interaction: InteractionService,
    private retailerService: RetailerService,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
    this.sharedService.comp1Val = "";
  }

  ngOnInit() {
    this.interaction.expandedStatus$.subscribe((res) => {
      this.isSidePanelExpanded = res;
    });
    this.retailerService.getAllRetailers().subscribe((res) => {
      this.allRetailers = res.body;
      this.dataSource=new MatTableDataSource(this.allRetailers);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
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
  getRecord(selectRow: any) {
    this.record = selectRow;
    this.sharedService.updateComp1Val(selectRow);
    this.router.navigate(["/transactions"]);
  }
}
