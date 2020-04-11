import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-analytic-container',
  templateUrl: './analytic-container.component.html',
  styleUrls: ['./analytic-container.component.scss']
})
export class AnalyticContainerComponent implements OnInit {
  @Input() data: any;
  constructor() { }

  ngOnInit() {
  }

}
