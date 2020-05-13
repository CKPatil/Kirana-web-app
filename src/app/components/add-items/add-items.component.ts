import { Component, Inject, Input } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { PRODUCTS_UNITS } from './../../constants/constants';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss'],
})
export class AddItemsComponent {
  @Input() productsData;

  constructor(
    public dialog: MatDialog,
    private productService: ProductsService,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {}

  // Open dialog box after pressing Add Item button

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddItemComponent, {
      width: '90%',
      maxWidth: '500px',
      data: this.productsData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let variant_details = result.variant_details;
        result.variants = [];
        result.quantity = [];
        result.price = [];
        result.quantity_type = [];
        variant_details.forEach((val) => {
          result.variants.push(val.variant);
          result.quantity.push(parseInt(val.quantity));
          result.price.push(parseInt(val.price));
          result.quantity_type.push(val.quantity_type);
        });
        delete result.variant_details;
        console.log(result);
        this.productService.addProduct(result).subscribe(
          (result) => {
            this._snackbar.open('Item Added', '', {
              duration: 5000,
            });
            this.router
              .navigateByUrl('/login', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/items']);
              });
          },
          (error) => {
            this._snackbar.open(
              'Could not able to add the Item, Retry after sometime.',
              '',
              {
                duration: 5000,
              }
            );
          }
        );
      }
    });
  }
}

// Dialog to ADD ITEM
@Component({
  selector: 'app-add-items-dialogue',
  templateUrl: './add-items-dialogue.html',
  styleUrls: ['./add-items-dialogue.scss'],
})
export class DialogAddItemComponent {
  itemForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    category: ['', [Validators.required, Validators.maxLength(50)]],
    sub_category: ['', [Validators.required, Validators.maxLength(50)]],
    brand: ['', [Validators.required, Validators.maxLength(50)]],
    // quantity_type: ["", Validators.required],
    variant_details: this.fb.array(
      [
        this.fb.group({
          variant: ['', [Validators.required, Validators.maxLength(50)]],
          quantity: ['', [Validators.required, Validators.min(0)]],
          quantity_type: ['', Validators.required],
          price: ['', [Validators.required, Validators.min(0)]],
        }),
      ],
      [Validators.required, Validators.minLength(1)]
    ),
    details: ['', [Validators.required, Validators.maxLength(500)]],
  });
  quantity_types = PRODUCTS_UNITS;

  isAddCategory: boolean;
  isAddSubCategory: boolean;
  isAddBrand: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogAddItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder
  ) {}

  // Close the add item dialog box on pressing outside the screen
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Check whether category is new or old
  addCategory() {
    this.isAddCategory = this.isAddCategory ? false : true;
  }

    // Check whether subcategory is new or old
  addSubCategory() {
    this.isAddSubCategory = this.isAddSubCategory ? false : true;
  }

    // Check whether brand is new or old
  addBrand() {
    this.isAddBrand = this.isAddBrand ? false : true;
  }

  get allVariants() {
    return this.itemForm.get('variant_details') as FormArray;
  }

  // add a particular variant to new item
  addVariant() {
    const varient = this.itemForm.controls.variant_details as FormArray;
    varient.push(
      this.fb.group({
        variant: ['', [Validators.required, Validators.maxLength(50)]],
        quantity: ['', [Validators.required, Validators.min(0)]],
        quantity_type: ['', Validators.required],
        price: ['', [Validators.required, Validators.min(0)]],
      })
    );
  }

  // remove the variant from the variants list
  removeVariant(i) {
    const varient = this.itemForm.controls.variant_details as FormArray;
    varient.removeAt(i);
  }
}
