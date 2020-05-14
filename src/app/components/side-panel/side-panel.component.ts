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
        this.selectedOption = this.getNavOptionFromUrl(this.navOptions, event.url);
      }
    });
  }

  ngOnInit() {
    this.selectedOption = this.getNavOptionFromUrl(this.navOptions, this.router.url);
  }

  getNavOptionFromUrl(navOptions: [any], url: string) {
    let navoption = '';
    navOptions.forEach(val => {
      if (url.includes(val.link)) {
        navoption = val;
      }
    });
    return navoption;
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
