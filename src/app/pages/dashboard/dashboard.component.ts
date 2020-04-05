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
  orderStatus: any = 'Packed';
  orderStatusPacked: boolean;
  constructor(private interaction: InteractionService,private transactionService: TransactionService) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  ngOnInit() {
    this.analytics = analytics;
    this.interaction.expandedStatus$.subscribe( (res) => {
      this.isSidePanelExpanded = res;
    });
    this.getTransactions("?order=listall");
    this.transactionService.buildURLS("?order=delivered");
    this.transactionService.getAllOrders().subscribe((res) => {
      this.allTransactions.push(res.body);
      console.log("Dashboard component");
    });
    this.transactionService.buildURLS("?order=cancelled");
    this.transactionService.getAllOrders().subscribe((res) => {
      this.allTransactions.push(res.body)
      console.log(this.allTransactions);
      console.log("Dashboard component");
    });

  }
  getTransactions(orderType:string){
    this.transactionService.buildURLS(orderType);
    this.transactionService.getAllOrders().subscribe((res) => {
      this.allTransactions = res.body;
      console.log(this.allTransactions);
      console.log("Dashboard component");
    });
  }
}