
import { OnChanges } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
// import { InteractionService } from 'src/app/services/interaction.service';

import {
  Component,
  OnInit,
  AfterContentChecked
} from '@angular/core';
import {
  InteractionService
} from 'src/app/services/interaction.service';
import {
  TransactionService
} from 'src/app/services/transaction.service';
import { FormGroup, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material';
import { SharedService } from "../../services/shared.service";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnChanges {

  searchRetail:any;
  searchStatus:any;
  searchDate1:any;
  searchDate:any;
  taskTotal = 10;
  taskRemaining = 0;
  retailers = [
    {
      value: 'retailer-1',
      viewValue: 'Pranav'
    },
    {
      value: 'retailer-2',
      viewValue: 'Vijay'
    },
    {
      value: 'retailer-3',
      viewValue: 'Rebecca'
    }
  ];
  status = [
    {
      value: 'status-1',
      viewValue: 'Delivered'
    },
    {
      value: 'status-2',
      viewValue: 'Ordered'
    },
    {
      value: 'status-3',
      viewValue: 'Packed'
    },
    {
      value: 'status-4',
      viewValue: 'Cancelled'
    },
    {
      value: 'status-5',
      viewValue: 'Dispatched'
    }
  ];
  today = Date.now();
  daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dateNumber = 0;

  filters: string[];
  isSidePanelExpanded: boolean;
  // tslint:disable-next-line: max-line-length
  allTransactions: {
    Consumer: {
      Name: string;
      Area: string; 
    }; 
    Retailer: {
      Name: string; 
      Area: string;
    };
    OrderDetails: {
      OrderDate: string; 
      ItemsPurchased: {
        ItemName: string; 
        ItemPrice: number; 
        Quantity: number;
      } []; 
      TotalPrice: number;
    };
    Status: string;
  } [];
  comp1val: string;
  comp2val: string;

  constructor(private interaction: InteractionService, private transaction: TransactionService,private sharedService: SharedService) {
    this.filters = ['Retailer', 'Status', 'Date'];
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();

  }

  ngOnInit() {
    this.interaction.expandedStatus$.subscribe((res) => {
      this.isSidePanelExpanded = res;
    });
    this.getTransactionHistory();

    console.log(this.searchDate);
  }

  ngOnChanges() {
    console.log(this.searchDate);

  }
  ngAfterContentChecked(){
    this.searchRetail=this.sharedService.comp1Val;
  }

  addEvent(type : string, event: MatDatepickerInputEvent<Date>){
    this.searchDate1 = (`${type}:${event.value.toLocaleDateString()}`);
    this.searchDate=this.searchDate1.slice(6,16);
  }

  getTransactionHistory() {
    this.allTransactions = this.transaction.getAllTransactions();
    this.transaction.getAllOrders().subscribe((res) => {
      console.log(res);
    });
  }


  setStatusColor(status) {
    return status;
  }

}
