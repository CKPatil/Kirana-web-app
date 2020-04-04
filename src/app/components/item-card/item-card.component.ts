import { Component, OnInit, Input, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ProductsService } from "src/app/services/products.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-item-card",
  templateUrl: "./item-card.component.html",
  styleUrls: ["./item-card.component.scss"],
})
export class ItemCardComponent implements OnInit {
  @Input() item: any;
  constructor(
    private dialog: MatDialog,
    private productService: ProductsService,
    private router: Router
  ) {}

  openConfirmDeleteDialog() {
    if (confirm("Do you realy wanted to delete the Product?")) {
      this.openSelectVarietyDialog();
    }
  }

  openSelectVarietyDialog() {
    const dialogRef = this.dialog.open(SelectVarietyDialog, {
      width: "20em",
      data: this.item.variant_details,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let deleteDetail = result.split(" ");
        let deleteURL = "";
        if (deleteDetail[0] === "all") {
          deleteURL = `?p_id=${deleteDetail[1]}`;
        } else if (deleteDetail[0] === "one") {
          deleteURL = `?id=${deleteDetail[1]}`;
        }
        this.productService.deleteProduct(deleteURL).subscribe(
          (result) => {
            alert("Product Deleted");
            this.router
              .navigateByUrl("/login", { skipLocationChange: true })
              .then(() => {
                this.router.navigate(["/items"]);
              });
          },
          (error) => {
            console.log("Error Occured : ", error);
            alert("Error Occured in Deleting the Product");
          }
        );
      }
    });
  }
  ngOnInit() {}
}

// //////////// SelectVarietyDialog
@Component({
  selector: "selectVarietyDialog",
  templateUrl: "selectVarietyDialog.html",
})
export class SelectVarietyDialog {
  constructor(
    public dialogRef: MatDialogRef<SelectVarietyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectedValue;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
