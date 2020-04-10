import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { analytics } from './../../constants/mockup-data';
import { TransactionService } from './../../services/transaction.service';
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


  constructor(private interaction: InteractionService,private transactionService: TransactionService) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  ngOnInit() {
    this.analytics = analytics;
    this.interaction.expandedStatus$.subscribe( (res) => {
      this.isSidePanelExpanded = res; 
    });
    this.currentDate=new Date();
    this.transactionService.buildURLS("?order=listall");
    this.transactionService.getAllOrders().subscribe((res) => {
      console.log(res);
      console.log("allTransactions")
      this.allTransactions = res.body;
      //console.log(this.currentDate);
      
      // this.allTransactions.forEach(element => {
      //   element.timestamp=new Date(element.timestamp);
      //   this.deliveryTime=new Date(element.timestamp.getTime()+(2*60*60*1000));
      //   console.log(element.timestamp);
      //   console.log(this.deliveryTime);
      //   this.timeDiff=this.deliveryTime-this.currentDate;
      //   this.timeDiff=(((this.timeDiff/1000)/60)/60);
      //   console.log(this.timeDiff);
        
      // });
      // this.orderTime.forEach(element => {
      //   element=new Date(element).toISOString();
      //   console.log(typeof element);
        
      // });
      // console.log(this.orderTime);
      
      console.log(this.allTransactions);
      console.log(this.packedOrders);
      
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