import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { analytics } from './../../constants/mockup-data';
import { TransactionService } from './../../services/transaction.service';
import { RetailerService } from './../../services/retailer.service';

import { EmptyError } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isSidePanelExpanded: boolean;
  analytics: { name: string; count: number; }[];
  allTransactions:any;
  packedOrders=[];
  orderStatus="Packed";
  orderStatusPacked: boolean;
  cancelledOrders:any;
  allOrders:any;
  currentDate:any;
  orderTime=[];
  timeDiff:any;
  deliveryTime:any;
  allRetailers:any;

  constructor(private interaction: InteractionService,private transactionService: TransactionService,private retailerService: RetailerService) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  ngOnInit() {
    this.analytics=analytics;
    this.interaction.expandedStatus$.subscribe( (res) => {
      this.isSidePanelExpanded = res; 
    });
    this.currentDate=new Date();
    this.transactionService.buildURLS("?order=listall");
    this.transactionService.getAllOrders().subscribe((res) => {
      console.log(res);
      console.log("allTransactions")
      this.allTransactions = res.body;
      console.log(this.currentDate);
      
      this.allTransactions.forEach(element => {
        if(element.status=="Ordered"){
          this.analytics[1].count++;
        }else if(element.status=="Packed"){
          this.analytics[2].count++;
        }else if(element.status=="Delivered"){
          this.analytics[3].count++;
        }else if(element.remaining_time<0){
          this.analytics[0].count++;
        }
      });

      this.analytics.forEach(element => {
        
      });


      console.log(this.allTransactions);
      console.log(this.packedOrders);
      
    });
    this.retailerService.getAllRetailers().subscribe((res) => {
      console.log(res);
      this.allRetailers = res.body;
      console.log(this.allRetailers);
      this.allRetailers.forEach(element => {
        this.analytics[4].count++;
      });
    });
    // this.transactionService.buildURLS("?order=delivered");
    // this.transactionService.getAllOrders().subscribe((res) => {
    //   console.log("allOrders");
    //   this.allOrders = res.body;
    //   console.log(this.allOrders);
    // });
    // this.transactionService.buildURLS("?order=cancelled");
    // this.transactionService.getAllOrders().subscribe((res) => {
    //   console.log("cancelledOrders");
    //   this.cancelledOrders = res.body;
    //   console.log(this.cancelledOrders);
    // });
  }
  getTransactions(orderType:string){
  }
}