import { FilterPipe } from './../../pipes/filter.pipe';
import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
  providers: [FilterPipe]
})
export class FeedbacksComponent implements OnInit {
  searchRetail: any;
  searchRating: any;
  searchDate: any;
  feedbacks = [
    {
      name: 'Pranav',
      stars: '4',
      date: '21/02/2020',
      description: 'Very good and on time delivery. Very much satisfied with the pricing as well.'
    },
    {
      name: 'Vijay',
      stars: '5',
      date: '22/02/2020',
      description: 'Smooth app with best UX'
    },
    {
      name: 'Vijay',
      stars: '5',
      date: '23/02/2020',
      description: 'Smooth app with best UX'
    },
  ];
  retailers = [
    {
      value: 'retailer-1',
      viewValue: 'Pranav'
    },
    {
      value: 'retailer-2',
      viewValue: 'Vijay'
    },
  ];
  filters: { [key: string]: any; } = {};
  filteredData: { name: string; stars: string; date: string; description: string; }[];
  isSidePanelExpanded: any;


  constructor(private multiFilter: FilterPipe, private interaction: InteractionService) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  ngOnInit() {
    this.filteredData = this.feedbacks;
  }

  onRatingFilterChange(value: string) {
    this.filters.stars = value;
    this.filter();
  }

  onRetailerFilterChange(value: string) {
    this.filters.name = value;
    this.filter();
  }

  onDateFilterChange(value: Date) {
    this.filters.date = value.getDate() + '/0' + value.getMonth() + '/' + value.getFullYear();
    console.log(this.filters);
    this.filter();
  }

  filter() {
    this.filteredData = this.multiFilter.transform(this.feedbacks, this.filters);
  }

}
