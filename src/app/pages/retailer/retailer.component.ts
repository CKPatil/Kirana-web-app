import { RetailerService } from './../../services/retailer.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

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
  {name: 'Pranav', email: 'pranavpace97@gmail.com', phone: 9206877149, shop: 'Webknot', totalBusiness: 50000, recentActivity: '5 min' },
  {name: 'Pranav', email: 'pranavpace97@gmail.com', phone: 9206877149, shop: 'Webknot', totalBusiness: 50000, recentActivity: '5 min' },
  {name: 'Pranav', email: 'pranavpace97@gmail.com', phone: 9206877149, shop: 'Webknot', totalBusiness: 50000, recentActivity: '5 min' },
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
  displayedColumns: string[] = ['name', 'email', 'phone', 'shop', 'totalBusiness', 'recentActivity'];
  dataSource;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  allRetailers: any;

  constructor(private interaction: InteractionService, private retailerService: RetailerService) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
    this.retailerService.getAllRetailers().subscribe((res) => {
      console.log(res);
      this.allRetailers = res;
    });
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngOnInit() {
    this.interaction.expandedStatus$.subscribe( (res) => {
      this.isSidePanelExpanded = res;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
