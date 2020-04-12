import { ProductsService } from "./../../services/products.service";
import { Component, OnInit } from "@angular/core";
import { InteractionService } from "src/app/services/interaction.service";

@Component({
  selector: "app-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.scss"],
})
export class ItemsComponent implements OnInit {
  isSidePanelExpanded: boolean;

  searchText;
  allProducts: any = [];
  productsData: any;

  constructor(
    private interaction: InteractionService,
    private productService: ProductsService
  ) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();

    this.productService.getAllProducts().subscribe(
      (result) => {
        this.allProducts = result.body;
        this.productsData = this.prepareDataForNewItem();
      },
      (error) => {
        console.log("Error : ", error);
        alert("Error Occured while Fetching the Products");
      }
    );
  }

  // to get the categories, subcategories and Brand and send to add Item Component from All Products Data
  prepareDataForNewItem() {
    let data = { categories: [], sub_categories: {}, brands: {} };
    this.allProducts.forEach((val) => {
      data.categories.push(val.category);
      if (data.sub_categories[val.category]) {
        data.sub_categories[val.category].push(val.sub_category);
      } else {
        data.sub_categories[val.category] = [val.sub_category];
      }
      if (data.brands[val.sub_category]) {
        data.brands[val.sub_category].push(val.brand);
      } else {
        data.brands[val.sub_category] = [val.brand];
      }
    });

    return data;
  }

  ngOnInit() {
    this.interaction.expandedStatus$.subscribe((res) => {
      this.isSidePanelExpanded = res;
    });
  }
}
