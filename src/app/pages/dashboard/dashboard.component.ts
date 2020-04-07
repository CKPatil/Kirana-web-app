import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { analytics } from './../../constants/mockup-data';
import { TransactionService } from './../../services/transaction.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isSidePanelExpanded: boolean;
  analytics: { name: string; count: number; }[];
  allTransactions:any;
  packedOrders:any;
  orderStatus: any = 'Dispatched';
  orderStatusPacked: boolean;
  cancelledOrders:any;
  allOrders:any;

  constructor(private interaction: InteractionService,private transactionService: TransactionService) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  ngOnInit() {
    this.analytics = analytics;
    this.interaction.expandedStatus$.subscribe( (res) => {
      this.isSidePanelExpanded = res; 
    });
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
  getTransactions(orderType:string){
  }
}