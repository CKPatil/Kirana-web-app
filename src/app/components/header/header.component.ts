import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }

  feedbacks() {
    this.router.navigate(['/feedbacks']);
  }
  ResetPass() {
    this.router.navigate(['/reset-password']);
  }

}
