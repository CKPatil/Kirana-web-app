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

  // MOCK Data
  feedbacks = [
    {
      name: "Pranav",
      stars: "3.5",
      date: "21/02/2020",
      description:
        "Very good and on time delivery. Very much satisfied with the pricing as well.",
    },
    {
      name: "Vijay",
      stars: "5",
      date: "22/02/2020",
      description: "Smooth app with best UX",
    },
    {
      name: "Vijay",
      stars: "5",
      date: "23/02/2020",
      description: "Smooth app with best UX",
    },
  ];
  retailers = [
    {
      value: "retailer-1",
      viewValue: "Pranav",
    },
    {
      value: "retailer-2",
      viewValue: "Vijay",
    },
  ];
  // END Mock Data

  filters: { [key: string]: any } = {};
  filteredData: {
    name: string;
    stars: string;
    date: string;
    description: string;
  }[];
  isSidePanelExpanded: any;

  allFeedbacks;
  allVendors: {
    vendor_name: String;
  }[] = [];

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

  onRatingFilterChange(value: string) {
    this.filters.rating = parseInt(value);
    this.filter();
  }

  onRetailerFilterChange(value: string) {
    this.filters.vendor_name = value;
    this.filter();
  }

  onDateFilterChange(value: Date) {
    this.filters.date = this.parseDate(value);
    // value.getDate() + "/0" + value.getMonth() + "/" + value.getFullYear();
    this.filter();
  }

  filter() {
    this.filteredData = this.multiFilter.transform(
      this.allFeedbacks,
      this.filters
    );
  }

  resetFilter() {
    this.filters = {};
    this.searchRetail = "";
    this.searchRating = "";
    this.searchDate = "";
    this.filter();
  }

  getAllFeedbacks() {
    this.feedbackService.getAllFeedbacks().subscribe((result: any) => {
      let response = result.body;
      console.log(response);
      let allFeedbacks = [];
      let allVendors = [];
      response.forEach((val) => {
        val.forEach((value, index) => {
          if (index === val.length - 1) {
            allVendors.push(val[val.length - 1]);
          } else {
            let vendor = {
              customer_name: value.customer_name,
              rating: value.rating,
              comment: value.comments,
              vendor_name: val[val.length - 1].vendor_name,
              date: this.parseDate(value.date_time),
            };
            allFeedbacks.push(vendor);
          }
        });
      });

      this.allFeedbacks = allFeedbacks;
      this.filteredData = allFeedbacks;
      this.allVendors = allVendors;

      console.log("All Feedback", allFeedbacks);
      console.log("All Vendors", allVendors);
    });
  }

  parseDate = (d) => {
    d = new Date(d);
    let date = d.getDate();
    date = ("" + date).length === 1 ? "" + 0 + date : date;
    let month = d.getMonth();
    month = ("" + month).length == 1 ? "" + 0 + month : month;
    let year = d.getFullYear();
    return `${date}/${month}/${year}`;
  };
}
