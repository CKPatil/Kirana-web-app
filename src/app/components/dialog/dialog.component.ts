import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  statusValue: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})

// Changing status of order
export class DialogComponent implements OnInit {
  dataOnClose: any;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    ngOnInit() {
      this.dataOnClose = {
        button: 'YES',
        data: this.data

      };
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
