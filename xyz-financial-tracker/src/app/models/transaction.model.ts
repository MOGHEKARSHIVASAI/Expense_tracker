export interface Expense {
  id?: number;
  property: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
}

export interface Income {
  id?: number;
  property: string;
  source: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  earthyEscapeIncome: number;
  earthyEscapeExpense: number;
  millenniumIncome: number;
  millenniumExpense: number;
}

export const PROPERTIES = ['Earthy Escape', 'Millennium Farm House'];

export const EXPENSE_CATEGORIES = [
  'Maintenance',
  'Utilities',
  'Staff',
  'Supplies',
  'Marketing',
  'Insurance',
  'Other'
];

export const INCOME_SOURCES = [
  'Booking',
  'Event',
  'Restaurant',
  'Activities',
  'Other'
];

export const PAYMENT_METHODS = [
  'Cash',
  'Bank Transfer',
  'Online',
  'Cheque',
  'UPI'
];

export type TimePeriod = 'monthly' | 'quarterly' | 'yearly';