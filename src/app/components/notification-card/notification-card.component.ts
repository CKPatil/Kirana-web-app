import { TransactionService } from './../../services/transaction.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {
  @Input() notification: any;
  @Input() message: any;
  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
  }
  onClick(orderId) {
    this.transactionService.readNotification(orderId)
      .subscribe( (res) => {
        this.transactionService.getOrdersFromServer();
      });
  }
}
