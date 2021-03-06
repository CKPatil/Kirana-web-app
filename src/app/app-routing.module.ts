import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RetailerComponent } from './pages/retailer/retailer.component';
import { ItemsComponent } from './pages/items/items.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { FeedbacksComponent } from './pages/feedbacks/feedbacks.component';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'retailer',
    component: RetailerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'items',
    component: ItemsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'feedbacks',
    component: FeedbacksComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notifications',
    component: NotificationsPageComponent,
    canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
