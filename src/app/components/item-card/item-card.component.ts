import { Component, Input, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ProductsService } from "src/app/services/products.service";
import { Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-item-card",
  templateUrl: "./item-card.component.html",
  styleUrls: ["./item-card.component.scss"],
})
export class ItemCardComponent {
  @Input() item: any;

  constructor(
    private dialog: MatDialog,
    private productService: ProductsService,
    private router: Router
  ) {}

  displayedColumns = ["variant", "quantity", "price", "edit"];

  openConfirmDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteConformationDialog, {
      width: "20em",
      data: "",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openSelectVarietyDialog();
      }
    });
  }

  // for deleting the Variant
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
          (result: any) => {
            if (result.error) {
              alert("Error Occured in Deleting the Product");
              return 0;
            }
            alert("Product Deleted");
            this.router
              .navigateByUrl("/login", { skipLocationChange: true })
              .then(() => {
                this.router.navigate(["/items"]);
              });
          },
          (error) => {
            alert("Error Occured in Deleting the Product");
          }
        );
      }
    });
  }

  // for image upload
  openSelectImageDialog() {
    const dialogRef = this.dialog.open(SelectImageDialog, {
      width: "20em",
      data: this.item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.value.image) {
        let formData = new FormData();

        formData.append("type", "products");
        formData.append("category", this.item.category);
        formData.append("sub_category", this.item.sub_category);
        formData.append("brand", this.item.brand);
        formData.append("image", result.value.image);

        this.productService.uploadImage(formData).subscribe(
          (result) => {
            alert("Image Uploaded");
            this.router
              .navigateByUrl("/login", { skipLocationChange: true })
              .then(() => {
                this.router.navigate(["/items"]);
              });
          },
          (error) => {
            alert("Error Occured In Image Upload");
          }
        );
      }
    });
  }

  // to open image slider dialog
  openImageSliderDialog() {
    const dialogRef = this.dialog.open(ImageSliderDialog, {
      width: "90%",
      maxWidth: "25em",
      height: "25em",
      data: this.item.image_url,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  // for updating the product detail
  openEditProductDetailDialog() {
    const dialogRef = this.dialog.open(EditProductDetailDialog, {
      width: "20em",
      data: this.item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService
          .updateProduct(result, "?p_id=" + this.item.variant_details[0].p_id)
          .subscribe(
            (result) => {
              alert("Product Detail Updated");
              this.router
                .navigateByUrl("/login", { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(["/items"]);
                });
            },
            (error) => {
              alert("Error Occured while Updating the Detail");
            }
          );
      }
    });
  }
}

// //////////// Delete Conformation Dialog
@Component({
  selector: "deleteConformationDialog",
  templateUrl: "deleteConformationDialog.html",
})
export class DeleteConformationDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteConformationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
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

// ///////////// Select the Image Modal
@Component({
  selector: "selectImageDialog",
  templateUrl: "selectImageDialog.html",
})
export class SelectImageDialog {
  constructor(
    public dialogRef: MatDialogRef<SelectImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  picUploadForm = this.fb.group({
    image: [""],
  });

  onClick() {
    const fileUpload = document.getElementById(
      "fileUpload"
    ) as HTMLInputElement;
    fileUpload.onchange = (e) => {
      this.onFileSelect(e);
    };
    fileUpload.click();
  }

  // run when file field changes
  onFileSelect(event) {
    let previewImageContainer = document.querySelector(
      ".previewImageContainer"
    ) as HTMLElement;
    let img1 = document.createElement("img") as HTMLImageElement;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      let fr = new FileReader();
      fr.onload = (e) => {
        img1.src = e.target.result.toString();
        img1.width = 100;
        previewImageContainer.innerHTML = "";
        previewImageContainer.appendChild(img1);
      };

      fr.readAsDataURL(file);

      this.picUploadForm.get("image").setValue(file);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// ///////////// Image Slider Dialog
@Component({
  selector: "imageSliderDialog",
  templateUrl: "imageSliderDialog.html",
})
export class ImageSliderDialog {
  constructor(
    public dialogRef: MatDialogRef<ImageSliderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleImageUrlError(e) {}
}

// ////////// Update Product Detail Dialog
@Component({
  selector: "editProductDetailDialog",
  templateUrl: "editProductDetailDialog.html",
})
export class EditProductDetailDialog {
  constructor(
    public dialogRef: MatDialogRef<EditProductDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.itemForm.setValue({
      name: data.name,
      description: data.details,
    });
  }

  itemForm = this.fb.group({
    name: ["", [Validators.required]],
    description: ["", [Validators.required]],
  });

  onNoClick(): void {
    this.dialogRef.close();
  }
}
