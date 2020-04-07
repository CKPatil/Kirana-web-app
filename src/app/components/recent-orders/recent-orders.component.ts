import { DialogComponent } from './../../components/dialog/dialog.component';
import { Orders } from './../../constants/mockup-data';
import { Status } from './../../models/models';
import {Component, OnInit, ViewChild, Inject, Input} from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { TransactionService } from './../../services/transaction.service';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface Order {
  consumer: string;
  shop: string;
  phone: number;
  status: any;
  total: number;
  time_left: string;
}

interface StatusMenu {
  value: string;
  viewValue: string;
}

const ELEMENT_DATA: Order[] = Orders;


@Component({
  selector: 'app-recent-orders',
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.scss']
})
export class RecentOrdersComponent implements OnInit {
  @Input('orderStatus') orderStatus:any;
  isSidePanelExpanded: boolean;
  displayedColumns: string[] = ['consumer', 'shop', 'phone', 'status', 'total', 'time_left'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  allTransactions: any;
  allOrders: any;
  cancelledOrders: any;
  selectedValue: string;
  status: StatusMenu[] = [
    {value: Status.CANCELLED, viewValue: Status.CANCELLED},
    {value: Status.DELIVERED, viewValue: Status.DELIVERED},
    {value: Status.DISPATCHED, viewValue: Status.DISPATCHED},
    {value: Status.ORDERED, viewValue: Status.ORDERED},
    {value: Status.PACKED, viewValue: Status.PACKED}
  ];

  constructor(private interaction: InteractionService, public dialog: MatDialog,private transactionService: TransactionService) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }
  
  ngOnInit() {  
    this.interaction.expandedStatus$.subscribe( (res) => {
      this.isSidePanelExpanded = res;
    });

    console.log(this.orderStatus);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.transactionService.buildURLS("?order=listall");
    this.transactionService.getAllOrders().subscribe((res) => {
      console.log(res);
      console.log("allTransactions")
      this.allTransactions = res.body;
      console.log(this.allTransactions);
    });
    this.transactionService.buildURLS("?order=delivered");
    this.transactionService.getAllOrders().subscribe((res) => {
      console.log("allOrders");
      this.allOrders = res.body;
      console.log(this.allOrders);
    });
    this.transactionService.buildURLS("?order=cancelled");
    this.transactionService.getAllOrders().subscribe((res) => {
      console.log("cancelledOrders");
      this.cancelledOrders = res.body;
      console.log(this.cancelledOrders);
    });
  }
  getOrders(){

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onStatusChange(event: any,row: any) {
    this.openDialog(event.value,row);
  }

  getStatusToKeyMap(status: string){
    switch(status){
      case 'Delivered' :
        return 3;break;
      case 'Packed' :
        return 1;break;      
      case 'Dispatched' :
        return 2;break;
      case 'Cancelled' :
        return 4;break;
    }
  }

  openDialog(status: any,row: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {statusValue: status,row: row}
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( result.button === 'YES' ) {
        
        this.transactionService.updateOrderStatus(result.data.row.id,this.getStatusToKeyMap(result.data.statusValue))
        .subscribe((res)=>{
          console.log(res);
        })
      } else {

      }
    });
  }

}
