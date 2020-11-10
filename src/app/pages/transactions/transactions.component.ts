import { Component, OnInit, OnDestroy } from '@angular/core';
// import { InteractionService } from 'src/app/services/interaction.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { FormControl } from '@angular/forms';
// import { MatDatepickerInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { STATUSES } from './../../constants/constants'
import * as XLSX from 'xlsx'; 
import { ExcelService } from 'src/app/services/excel.service';
import { SearchDatesPipe } from 'src/app/pipes/search-dates.pipe';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  providers:[SearchDatesPipe]
})
export class TransactionsComponent implements OnInit, OnDestroy {
  

  constructor(
    // private interaction: InteractionService,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private excelService:ExcelService,
    private searchDates:SearchDatesPipe
  ) {
    // this.isSidePanelExpanded = this.interaction.getExpandedStatus();
    
    
    
    
  }
  mypipe = new Ng2SearchPipe()

  pageEvent: PageEvent;
  pageSize = 25;
  pageSizeOptions: number[] = [25, 50, 100];
  length;
  page:number=1;
  fileName= 'ExcelSheet.xlsx';  

  result:any
  result1:any
  result2:any
  result3: any='';

  // searchRetail: any;
  // searchStatus: any;
  // searchDate: any;

  retailers = [];

  // status = ['Ordered', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'];
  status = STATUSES;

  // isSidePanelExpanded: boolean;

  allTransaction: any = [];
  removeDuplicate: string[] = [];
  temp = '';

  retailerControl = new FormControl();
  statusControl = new FormControl();
  dateControl = new FormControl();
  dateControl_to = new FormControl();

  // date: Date[] = [];
  orderDate: string[] = [];
  retailerFilteredOptions: Observable<string[]>;
  statusFilteredOptions: Observable<string[]>;

  // refresh;

  private _retailerfilter(value: string): string[] {
    const retailerFilterValue = value.toLocaleLowerCase();
    return this.retailers.filter((retailer) =>
      retailer.toLocaleLowerCase().includes(retailerFilterValue)
    );
    
  }

  private _statusFilter(value: string): string[] {
    const statusFilterValue = value.toLowerCase();
    return this.status.filter((state) =>
      state.toLowerCase().includes(statusFilterValue)
    );
  }

  ngOnInit() {
    // this.interaction.expandedStatus$.subscribe((res) => {
    //   this.isSidePanelExpanded = res;
    // });
    
    this.getTransactionHistory();
    
    // to set the filter from the query
    this.route.queryParams.subscribe(query => {
      if (query.retailer) {
        this.retailerControl.setValue(query.retailer);
      }
    });
  }

  // to clear the refresh interval
  ngOnDestroy() {
    // clearInterval(this.refresh);
  }

  // dateChanged(event: MatDatepickerInputEvent<Date>) {
  //   // this.getItemLengthAfterFilter()
  //   if (event.value) {
  //     this.searchDate = this.parseDate(event.value);
  //   } else {
  //     this.searchDate = '';
  //   }
  // }
  
  
  getTransactionHistory() {
    
    this.transactionService.observeOrders.subscribe((res) => {
      this.allTransaction = res;
      this.pageEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: this.allTransaction.length,
      };
      this.length = this.allTransaction.length;
      for (let i = 0; i < this.allTransaction.length; i++) {
        this.allTransaction[i].orderDate = this.parseDate(
          this.allTransaction[i].timestamp
        );
      }
      for (let i = 0; i < this.allTransaction.length; i++) {
        this.removeDuplicate.push(this.allTransaction[i].vendor_name);
      }

      this.removeDuplicate.sort();

      for (let i = 0; i < this.removeDuplicate.length; i++) {
        if (this.removeDuplicate[i] !== this.temp) {
          this.retailers.push(this.removeDuplicate[i]);
          this.temp = this.removeDuplicate[i];
        }
      }

      this.statusFilteredOptions = this.statusControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._statusFilter(value)) 
      );
      this.retailerFilteredOptions = this.retailerControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._retailerfilter(value))
      );

      this.statusControl.valueChanges.subscribe(() => {
        this.getItemLengthAfterFilter()
      })
      this.retailerControl.valueChanges.subscribe(() => {
        this.getItemLengthAfterFilter()
      })
      this.dateControl.valueChanges.subscribe(() => {
        this.getItemLengthAfterFilter()
      })
      this.dateControl_to.valueChanges.subscribe(() => {
        this.getItemLengthAfterFilter()
      })
      
    });
  }

  setStatusColor(status: any) {
    return status;
  }

  exportexcel(): void 
  {
    if(this.result3.length!=0){
      this.excelService.exportAsExcelFile(this.result3, 'sample');
    }else{
      this.excelService.exportAsExcelFile(this.allTransaction, 'sample');
    }
  }


  getItemLengthAfterFilter() {
    this.page=1
    this.result = this.mypipe.transform(this.allTransaction, this.retailerControl.value);
    this.result1 = this.mypipe.transform(this.result, this.statusControl.value);
    this.result2 = this.mypipe.transform(this.result1, this.parseDate(this.dateControl.value));
    this.result3= this.searchDates.transform(this.allTransaction,this.parseDate(this.dateControl.value),this.parseDate(this.dateControl_to.value),this.retailerControl.value,this.statusControl.value)
    this.length = this.result3.length;

  }

  onReset() {
    this.statusControl.setValue('');
    this.retailerControl.setValue('');
    this.dateControl.setValue('');
    this.dateControl_to.setValue('');
    this.length = this.allTransaction.length;
  }

  parseDate = (d) => {
    if (d) {
      d = new Date(d);
      let date = d.getDate();
      date = ('' + date).length === 1 ? '' + 0 + date : date;
      let month = d.getMonth();
      month = ('' + (month + 1)).length === 1 ? '' + 0 + (month + 1) : month + 1;
      const year = d.getFullYear();
      return `${date}/${month}/${year}`;
    }
  };

  trackByOrderId(index, item) {
    return item.id;
  }
}