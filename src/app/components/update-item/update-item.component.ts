import { Component, Inject, Input } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, Validators } from "@angular/forms";
import { ProductsService } from "src/app/services/products.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";

import { PRODUCTS_UNITS } from "./../../constants/constants";

@Component({
  selector: "app-update-item",
  templateUrl: "./update-item.component.html",
  styleUrls: ["./update-item.component.scss"],
})
export class UpdateItemComponent {
  @Input() variant: any;
  // @Input() unit: any;

  constructor(
    public dialog: MatDialog,
    private productService: ProductsService,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {}

  // for variant detail Update
  openDialog() {
    const dialogRef = this.dialog.open(UpdateItemModal, {
      width: "350px",
      data: { variant: this.variant },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService
          .updateProduct(result, "?id=" + this.variant.p_id)
          .subscribe(
            (result) => {
              this._snackbar.open("Product Variant Detail Updated", "", {
                duration: 5000,
              });
              this.router
                .navigateByUrl("/login", { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(["/items"]);
                });
            },
            (error) => {
              this._snackbar.open("Error Occured, try after sometime.", "", {
                duration: 5000,
              });
            }
          );
      }
    });
  }
}

@Component({
  selector: "app-add-items-dialogue",
  templateUrl: "./updateItemModal.html",
})
export class UpdateItemModal {
  itemForm = this.fb.group({
    variant: ["", [Validators.required, Validators.maxLength(50)]],
    quantity: ["", [Validators.required, Validators.min(0)]],
    quantity_type: ["", Validators.required],
    price: ["", [Validators.required, Validators.min(0)]],
  });

  products_unit = PRODUCTS_UNITS

  constructor(
    public dialogRef: MatDialogRef<UpdateItemModal>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder
  ) {
    this.itemForm.setValue({
      variant: data.variant.variant,
      quantity: data.variant.quantity,
      price: data.variant.price,
      quantity_type: data.variant.quantity_type
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
