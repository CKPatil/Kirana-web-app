import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  animations: [
    trigger('animationOption1', [
      state(
        'start',
        style({
          width: '72px'
        })
      ),
      state(
        'end',
        style({
          width: '150px'
        })
      ),
      transition('start => end', animate(0)),
      // transition('end => start', animate('0.4s ease-out'))
    ])
  ]
})
export class SidePanelComponent implements OnInit {

  @Input('navOptions') navOptions;
  isExpanded = false;
  navBarOptions: string[];
  @Output() Expanded = new EventEmitter<boolean>();
  selectedOption: any;
  clickedDivState = 'start';

  constructor(private router: Router, private activeroute: ActivatedRoute) {

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.navOptions.forEach(val => {
          if (event.url.includes(val.link)) {
            this.selectedOption = val
          }
        })
      }
    });
  }

  ngOnInit() {
    this.selectedOption = this.navOptions[0];
  }

  expandSidePanel() {
    this.isExpanded = this.isExpanded ? false : true;
    this.clickedDivState = (this.clickedDivState === 'end') ? 'start' : 'end';
    this.Expanded.emit(this.isExpanded);
  }

  navBarSelected(option) {
    this.selectedOption = option;
    this.router.navigate([this.selectedOption.link]);
  }

}
