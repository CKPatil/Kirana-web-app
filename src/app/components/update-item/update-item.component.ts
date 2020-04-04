import { Component, OnInit, Inject, Input } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormControl, Validators, FormGroup } from "@angular/forms";

@Component({
  selector: "app-update-item",
  templateUrl: "./update-item.component.html",
  styleUrls: ["./update-item.component.scss"],
})
export class UpdateItemComponent implements OnInit {
  ngOnInit(): void {}
  @Input() item: any;

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(UpdateItemModal, {
      width: "350px",
      data: this.item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      console.log(result);
    });
  }
}

@Component({
  selector: "app-add-items-dialogue",
  templateUrl: "./updateItemModal.html",
})
export class UpdateItemModal {
  itemForm = new FormGroup({
    categorySelected: new FormControl(null, Validators.required),
    subCategorySelected: new FormControl(null, Validators.required),
    brandSelected: new FormControl(null, Validators.required),
    quantitySelected: new FormControl(),
    variantSelected: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateItemModal>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
