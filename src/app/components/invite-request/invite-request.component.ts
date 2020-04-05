import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-invite-request',
  templateUrl: './invite-request.component.html',
  styleUrls: ['./invite-request.component.scss']
})
export class InviteRequestComponent implements OnInit {

  constructor() { }

  @Input() inviteRequest

  ngOnInit() {
  }

}
