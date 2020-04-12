import { Component, Inject, Input } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, Validators } from "@angular/forms";
import { ProductsService } from "src/app/services/products.service";

@Component({
  selector: "app-update-item",
  templateUrl: "./update-item.component.html",
  styleUrls: ["./update-item.component.scss"],
})
export class UpdateItemComponent {
  @Input() variant: any;

  constructor(
    public dialog: MatDialog,
    private productService: ProductsService
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(UpdateItemModal, {
      width: "350px",
      data: this.variant,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService
          .updateProduct(result, "?id=" + this.variant.p_id)
          .subscribe(
            (result) => {
              console.log("RESULT : ", result);
              alert("Product Variant Detail Updated");
            },
            (error) => {
              console.log("ERROR : ", error);
              alert("Error Occured while updating the Detail");
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
    variant: ["", [Validators.required]],
    quantity: ["", [Validators.required]],
    price: ["", [Validators.required]],
  });
  constructor(
    public dialogRef: MatDialogRef<UpdateItemModal>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder
  ) {
    this.itemForm.setValue({
      variant: data.variant,
      quantity: data.quantity,
      price: data.price,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
