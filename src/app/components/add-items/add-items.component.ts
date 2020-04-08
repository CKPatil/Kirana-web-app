import { Component, OnInit, Inject, Input } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { ProductsService } from "src/app/services/products.service";
import { Router } from "@angular/router";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "app-add-items",
  templateUrl: "./add-items.component.html",
  styleUrls: ["./add-items.component.scss"],
})
export class AddItemsComponent implements OnInit {
  animal: string;
  name: string;

  @Input() productData;

  constructor(
    public dialog: MatDialog,
    private productService: ProductsService,
    private router: Router
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddItemComponent, {
      width: "90%",
      maxWidth: "500px",
      data: this.productData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      console.log(result);
      if (result) {
        let variant_details = result.variant_details;
        result["variants"] = [];
        result["quantites"] = [];
        variant_details.forEach((val) => {
          result["variants"].push(val.variant);
          result["quantites"].push(val.quantity);
        });
        delete result.variant_details;
        console.log(result);
        this.productService.addProduct(result).subscribe((res) => {
          alert("Product Saved");
          this.router
            .navigateByUrl("/login", { skipLocationChange: true })
            .then(() => {
              this.router.navigate(["/items"]);
            });
        });
      }
    });
  }

  ngOnInit(): void {}
}

@Component({
  selector: "app-add-items-dialogue",
  templateUrl: "./add-items-dialogue.html",
  styleUrls: ["./add-items-dialogue.scss"],
})
export class DialogAddItemComponent {
  // categorySelected;
  // subCategorySelected;
  // brandSelected;
  // quantitySelected;
  // variantSelected;
  // itemForm = new FormGroup({
  //   categorySelected: new FormControl(null, Validators.required),
  //   subCategorySelected: new FormControl(null, Validators.required),
  //   brandSelected: new FormControl(null, Validators.required),
  //   quantitySelected: new FormControl(),
  //   variantSelected: new FormControl(),
  // });

  itemForm = this.fb.group({
    name: ["", Validators.required],
    category: ["", Validators.required],
    sub_category: ["", Validators.required],
    brand: ["", Validators.required],
    quantity_type: ["", Validators.required],
    variant_details: this.fb.array([
      this.fb.group({
        variant: "",
        quantity: "",
      }),
    ]),
    details: ["", Validators.required],
  });

  // categories = ["Dairy", "Grocery"];
  // sub_categories = {
  //   Dairy: ["Milk", "Butter"],
  //   Grocery: ["Rice", "Wheat"],
  // };
  // brands = {
  //   Rice: ["Basmathi"],
  //   Milk: ["Nandhini"],
  //   Wheat: ["Pillsburry"],
  // };
  quantity_types = ["ml", "ltr", "kg", "unit", "gm"];
  // variants = {
  //   ml: [100, 250, 500],
  //   ltr: [1],
  //   kg: [1],
  //   unit: [1],
  //   gm: [100, 250, 500],
  // };
  isAddCategory: boolean;
  isAddSubCategory: boolean;
  isAddBrand: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogAddItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder
  ) {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addCategory() {
    this.isAddCategory = this.isAddCategory ? false : true;
  }
  addSubCategory() {
    this.isAddSubCategory = this.isAddSubCategory ? false : true;
  }
  addBrand() {
    this.isAddBrand = this.isAddBrand ? false : true;
  }

  get allVariants() {
    return this.itemForm.get("variant_details") as FormArray;
  }

  addVariant() {
    const varient = this.itemForm.controls.variant_details as FormArray;
    varient.push(
      this.fb.group({
        variant: "",
        quantity: "",
      })
    );
  }

  removeVariant(i) {
    console.log(i);
    const varient = this.itemForm.controls.variant_details as FormArray;
    varient.removeAt(i);
  }

  addItem() {}
}
