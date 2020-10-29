import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchDates'
})
export class SearchDatesPipe implements PipeTransform {

  parseDate:any = (d) => {
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
  transform(value, arg1?:any, arg2?:any,arg3?:any,arg4?:any) {
    if(!arg1 || !arg2 || !arg3 || !arg4){

    return value;

    }else{
      let startDate = arg1.split('/').reverse().join(',');
      let endDate = arg2.split('/').reverse().join(',');
      
      let a = value.filter(m => 
          m.vendor_name==arg3 && m.status==arg4
             && (m.orderDate.split('/').reverse().join(',')) >= startDate
             && (m.orderDate.split('/').reverse().join(',')) <= endDate
      )   
      return a;      
    }

  }

  
}
