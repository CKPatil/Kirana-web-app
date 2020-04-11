import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  color: ThemePalette = 'accent';
  checkedNewOrder = false;
  checkedCancelledStatus = false;
  checkedCriticalStatus = false;
  disabled = false;

  constructor() { }

  ngOnInit(): void {
  }
  newOrdersChange(event) {
    console.log(event.checked.toString());
  }
  CriticalStatusChange(event) {
    console.log(event.checked.toString());
  }
  CancelledStatusChange(event) {
    console.log(event.checked.toString());
  }
}
