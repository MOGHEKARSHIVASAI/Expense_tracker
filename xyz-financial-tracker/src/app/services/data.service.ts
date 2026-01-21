import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Expense, Income } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000';
  
  private selectedPropertySubject = new BehaviorSubject<string>('All Properties');
  selectedProperty$ = this.selectedPropertySubject.asObservable();

  constructor(private http: HttpClient) {}

  // Property Selection
  setSelectedProperty(property: string): void {
    this.selectedPropertySubject.next(property);
  }

  getSelectedProperty(): string {
    return this.selectedPropertySubject.value;
  }

  // Expenses
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses`);
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/expenses`, expense);
  }

  updateExpense(id: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/expenses/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/expenses/${id}`);
  }

  // Income
  getIncome(): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.apiUrl}/income`);
  }

  addIncome(income: Income): Observable<Income> {
    return this.http.post<Income>(`${this.apiUrl}/income`, income);
  }

  updateIncome(id: number, income: Income): Observable<Income> {
    return this.http.put<Income>(`${this.apiUrl}/income/${id}`, income);
  }

  deleteIncome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/income/${id}`);
  }
}