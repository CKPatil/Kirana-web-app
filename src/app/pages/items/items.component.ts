import { ProductsService } from "./../../services/products.service";
import { Component, OnInit } from "@angular/core";
import { Items } from "../../constants/mockup-data";
import { InteractionService } from "src/app/services/interaction.service";

@Component({
  selector: "app-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.scss"],
})
export class ItemsComponent implements OnInit {
  isSidePanelExpanded: boolean;
  searchText;
  items: {
    name: string;
    unit: string;
    description: string;
    variety: string[];
  }[];
  allProducts: any = [];

  productData: any;

  constructor(
    private interaction: InteractionService,
    private productService: ProductsService
  ) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();

    this.productService.getAllProducts().subscribe((res) => {
      this.allProducts = res.body;
      console.log(res.body);
      this.productData = this.prepareDataForNewItem()
    });
  }

  prepareDataForNewItem() {
    let data = { categories: [], sub_categories: {}, brands: {} };
    this.allProducts.forEach((val) => {
      data.categories.push(val.category);
      if(data.sub_categories[val.category]){
        data.sub_categories[val.category].push(val.sub_category);
      }else{
        data.sub_categories[val.category] = [val.sub_category]
      }
      if(data.brands[val.sub_category]){
        data.brands[val.sub_category].push(val.brand);
      }else{
        data.brands[val.sub_category] = [val.brand];
      }
    });

    return data;
  }
  addProduct() {
    this.productService.addProduct({
      image: "@/Users/vijayanand/Downloads/cult.png",
      name: "sdscdf",
      category: "dscsdc",
      details: "csdcds",
      sub_category: "sscsdcc",
      variant: "scsdc",
      brand: "fdsfd",
      quantity_type: "scdsd",
      variants: ["dscsd", "csdcs"],
    });
  }

  ngOnInit() {
    // this.items = Items;
    // this.productService.getAllItems()
    // .subscribe(
    //   data => {
    //     this.items = data;
    //  }
    // );
    this.productService.getAllProducts()
      .subscribe( data => {
          this.items = data;
        }
      );
    this.interaction.expandedStatus$.subscribe((res) => {
      this.isSidePanelExpanded = res;
    });
  }
}