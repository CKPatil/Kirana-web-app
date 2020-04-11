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
  itemForm = this.fb.group({
    name: ["", Validators.required],
    variant_details: this.fb.array([
      // this.fb.group({
      //   // p_id: '',
      //   variant: "",
      //   quantity: "",
      // }),
    ]),
    details: ["", Validators.required],
  });
  constructor(
    public dialogRef: MatDialogRef<UpdateItemModal>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder
  ) {
    console.log(this.data);

    let newVariant = []
    this.data.variant_details.map(val=>{
      this.addVariant()
      newVariant.push({variant: val.variant, quantity: val.quantity})
    })

    let newData = {}
    newData['name'] = this.data.name
    newData['details'] = this.data.details
    newData['variant_details'] = newVariant

    this.itemForm.patchValue(newData)
  }

  onNoClick(): void {
    this.dialogRef.close();
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
}
