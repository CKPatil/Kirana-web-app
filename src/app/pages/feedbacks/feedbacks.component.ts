import { FilterPipe } from "./../../pipes/filter.pipe";
import { Component, OnInit } from "@angular/core";
import { InteractionService } from "../../../app/services/interaction.service";
import { FeedbackService } from "../../../app/services/feedback.service";

@Component({
  selector: "app-feedbacks",
  templateUrl: "./feedbacks.component.html",
  styleUrls: ["./feedbacks.component.scss"],
  providers: [FilterPipe],
})
export class FeedbacksComponent implements OnInit {
  searchRetail: any;
  searchRating: any;
  searchDate: any;

  filters: { [key: string]: any } = {};
  filteredData: {
    name: string;
    stars: string;
    date: string;
    description: string;
  }[];
  isSidePanelExpanded: any;

  allFeedbacks = [];
  allVendors = [];

  constructor(
    private multiFilter: FilterPipe,
    private interaction: InteractionService,
    private feedbackService: FeedbackService
  ) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();
  }

  ngOnInit() {
    this.getAllFeedbacks();
    this.filteredData = this.allFeedbacks;
  }

  // filtering based on rating
  onRatingFilterChange(value: string) {
    this.filters.rating = parseInt(value, 10);
    this.filter();
  }

  // filtering based on reatailer
  onRetailerFilterChange(value: string) {
    this.filters.vendor_name = value;
    this.filter();
  }

  // filtering based on date
  onDateFilterChange(value: Date) {
    this.filters.date = this.parseDate(value);
    this.filter();
  }

  // filtering based on all dates
  filter() {
    this.filteredData = this.multiFilter.transform(
      this.allFeedbacks,
      this.filters
    );
  }

  // reset all filters
  resetFilter() {
    this.filters = {};
    this.searchRetail = "";
    this.searchRating = "";
    this.searchDate = "";
    this.filter();
  }

  // get feedback from the service
  getAllFeedbacks() {
    this.feedbackService.getAllFeedbacks().subscribe(
      (result: any) => {
        result.body.forEach((val) => {
          val.forEach((value, index) => {
            if (index === val.length - 1) {
              this.allVendors.push(val[val.length - 1]);
            } else {
              this.allFeedbacks.push({
                customer_name: value.customer_name,
                rating: value.rating,
                comment: value.comments,
                vendor_name: val[val.length - 1].vendor_name,
                date: this.parseDate(value.date_time),
              });
            }
          });
        });
      },
      (error) => {
        alert("Error Occured While Getting Feedbacks");
      }
    );
  }

  // converting date to required format(dd/mm/yyyy);
  parseDate = (d) => {
    d = new Date(d);
    let date = d.getDate();
    date = ("" + date).length === 1 ? "" + 0 + date : date;
    let month = d.getMonth();
    month = ("" + month).length === 1 ? "" + 0 + month : month;
    const year = d.getFullYear();
    return `${date}/${month}/${year}`;
  }
}
