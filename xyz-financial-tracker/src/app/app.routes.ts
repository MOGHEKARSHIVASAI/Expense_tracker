import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseTrackerComponent } from './components/expense-tracker/expense-tracker.component';
import { IncomeManagementComponent } from './components/income-management/income-management.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'expenses', component: ExpenseTrackerComponent },
  { path: 'income', component: IncomeManagementComponent },
  { path: '**', redirectTo: '/dashboard' }
];