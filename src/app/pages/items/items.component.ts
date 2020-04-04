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
  allProducts: any;

  constructor(
    private interaction: InteractionService,
    private productService: ProductsService
  ) {
    this.isSidePanelExpanded = this.interaction.getExpandedStatus();

    this.productService.getAllProducts().subscribe((res) => {
      this.allProducts = res.body;
      console.log(res.body);
    });
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
    this.items = Items;
    this.interaction.expandedStatus$.subscribe((res) => {
      this.isSidePanelExpanded = res;
    });
  }
}
