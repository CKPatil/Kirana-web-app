import { SharedService } from './../../services/shared.service';
import { RetailerService } from './../../services/retailer.service';
import {Component, OnInit, ViewChild,AfterContentChecked} from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';

export interface Retailer {
  name: string;
  email: string;
  phone: number;
  shop: string;
  totalBusiness: number;
  recentActivity: string;
}

const ELEMENT_DATA: Retailer[] = [
  {name: 'Pranav', email: 'pranavpace97@gmail.com', phone: 9206877149, shop: 'Webknot', totalBusiness: 50000, recentActivity: '5 min' },
  {name: 'Vijay', email: 'pranavpace97@gmail.com', phone: 9206877149, shop: 'Webknot', totalBusiness: 50000, recentActivity: '5 min' },
  {name: 'Karan', email: 'pranavpace97@gmail.com', phone: 9206877149, shop: 'Webknot', totalBusiness: 50000, recentActivity: '5 min' },
  {name: 'Sumanth', email: 'pranavpace97@gmail.com', phone: 9206877149, shop: 'Webknot', totalBusiness: 50000, recentActivity: '5 min' },
  {name: 'Pranav', email: 'pranavpace97@gmail.com', phone: 9206877149, shop: 'Webknot', totalBusiness: 50000, recentActivity: '5 min' },
  {name: 'Pranav', email: 'pranavpace97@gmail.com', phone: 9206877149, shop: 'Webknot', totalBusiness: 50000, recentActivity: '5 min' },
  {name: 'Pranav', email: 'pranavpace97@gmail.com', phone: 9206877149, shop: 'Webknot', totalBusiness: 50000, recentActivity: '5 min' },
];


@Component({
  selector: 'app-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./retailer.component.scss']
})
export class RetailerComponent implements OnInit {
  isSidePanelExpanded: boolean;
  displayedColumns: string[] = ['name', 'email', 'phone', 'shop', 'totalBusiness', 'location'];
  dataSource;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  allRetailers: any;
  record:any;
  comp1val: string;
  comp2val: string;

  constructor(private interaction: InteractionService, private retailerService: RetailerService,private sharedService: SharedService,private router: Router) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
    this.retailerService.getAllRetailers().subscribe((res) => {
      console.log(res);
      this.allRetailers = res.body;
      console.log(this.allRetailers);
    });
    this.dataSource = new MatTableDataSource();
    this.sharedService.comp1Val="";
  }

  ngOnInit() {
    this.interaction.expandedStatus$.subscribe( (res) => {
      this.isSidePanelExpanded = res;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngAfterContentChecked(){ 
    this.comp2val = this.sharedService.comp2Val;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allRetailers.filter = filterValue.trim().toLowerCase();
  }
  getRecord(selectRow:any){
    this.record=selectRow;
    this.sharedService.updateComp1Val(selectRow);
    console.log(this.record);
    console.log(this.sharedService.comp1Val);
    this.router.navigate(['/transactions']);
  }
}
