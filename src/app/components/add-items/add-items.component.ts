import { Component, Inject, Input } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Validators, FormBuilder, FormArray } from "@angular/forms";
import { ProductsService } from "src/app/services/products.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-items",
  templateUrl: "./add-items.component.html",
  styleUrls: ["./add-items.component.scss"],
})
export class AddItemsComponent {
  @Input() productsData;

  constructor(
    public dialog: MatDialog,
    private productService: ProductsService,
    private router: Router
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddItemComponent, {
      width: "90%",
      maxWidth: "500px",
      data: this.productsData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let variant_details = result.variant_details;
        result["variants"] = [];
        result["quantity"] = [];
        result["price"] = [];
        variant_details.forEach((val) => {
          result["variants"].push(val.variant);
          result["quantity"].push(parseInt(val.quantity));
          result["price"].push(parseInt(val.price));
        });
        delete result.variant_details;
        this.productService.addProduct(result).subscribe(
          (result) => {
            console.log("Result: ", result);
            alert("Product Saved");
            this.router
              .navigateByUrl("/login", { skipLocationChange: true })
              .then(() => {
                this.router.navigate(["/items"]);
              });
          },
          (error) => {
            console.log("Error : ", error);
            alert("Error Occured while Adding New Item");
          }
        );
      }
    });
  }
}

// Dialog to ADD ITEM
@Component({
  selector: "app-add-items-dialogue",
  templateUrl: "./add-items-dialogue.html",
  styleUrls: ["./add-items-dialogue.scss"],
})
export class DialogAddItemComponent {
  itemForm = this.fb.group({
    name: ["", Validators.required],
    category: ["", Validators.required],
    sub_category: ["", Validators.required],
    brand: ["", Validators.required],
    quantity_type: ["", Validators.required],
    variant_details: this.fb.array(
      [
        this.fb.group({
          variant: ["", [Validators.required]],
          quantity: ["", [Validators.required]],
          price: ["", [Validators.required]],
        }),
      ],
      [Validators.required, Validators.minLength(1)]
    ),
    details: ["", Validators.required],
  });

  quantity_types = ["ml", "ltr", "kg", "unit", "gm"];

  isAddCategory: boolean;
  isAddSubCategory: boolean;
  isAddBrand: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogAddItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder
  ) {}

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
        variant: ["", [Validators.required]],
        quantity: ["", [Validators.required]],
        price: ["", [Validators.required]],
      })
    );
  }

  removeVariant(i) {
    console.log(i);
    const varient = this.itemForm.controls.variant_details as FormArray;
    varient.removeAt(i);
  }
}
