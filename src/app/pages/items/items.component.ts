import { ProductsService } from "./../../services/products.service";
import { Component } from "@angular/core";

@Component({
  selector: "app-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.scss"],
})
export class ItemsComponent {
  isSidePanelExpanded: boolean;

  searchText;
  allProducts: any = [];
  productsData: any;

  constructor(private productService: ProductsService) {
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
      if (!data.categories.includes(val.category)) {
        data.categories.push(val.category);
      }
      if (data.sub_categories[val.category]) {
        if (!data.sub_categories[val.category].includes(val.sub_category)) {
          data.sub_categories[val.category].push(val.sub_category);
        }
      } else {
        data.sub_categories[val.category] = [val.sub_category];
      }
      if (data.brands[val.sub_category]) {
        if (!data.brands[val.sub_category].includes(val.brand)) {
          data.brands[val.sub_category].push(val.brand);
        }
      } else {
        data.brands[val.sub_category] = [val.brand];
      }
    });

    return data;
  }
}
