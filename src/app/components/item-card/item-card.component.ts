import { Component, OnInit, Input, Inject } from "@angular/core";
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

  openSelectImageDialog() {
    const dialogRef = this.dialog.open(SelectImageDialog, {
      width: "20em",
      data: this.item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.value.image) {
        let imageData = result.value;
        imageData.type = "products";
        imageData.category = this.item.category;
        imageData.sub_category = this.item.sub_category;
        imageData.brand = this.item.brand;

        console.log(imageData);
        this.productService.uploadImage(imageData).subscribe((result) => {
          console.log(result);
          alert("Image Uploaded");
        });
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

// ///////////// Select the Image Modal
@Component({
  selector: "selectImageDialog",
  templateUrl: "selectImageDialog.html",
})
export class SelectImageDialog {
  constructor(
    public dialogRef: MatDialogRef<SelectVarietyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  picUploadForm = this.fb.group({
    type: [""],
    category: [""],
    image: [""],
    sub_category: [""],
    brand: [""],
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
