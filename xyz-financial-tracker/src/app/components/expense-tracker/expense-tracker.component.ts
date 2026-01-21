import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Expense, PROPERTIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../models/transaction.model';

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-tracker.component.html',
  styleUrls: ['./expense-tracker.component.css']
})
export class ExpenseTrackerComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  
  properties = PROPERTIES;
  categories = EXPENSE_CATEGORIES;
  paymentMethods = PAYMENT_METHODS;
  
  selectedProperty: string = 'All Properties';
  searchTerm: string = '';
  filterCategory: string = 'All';
  
  showForm: boolean = false;
  isEditing: boolean = false;
  
  currentExpense: Expense = this.getEmptyExpense();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.selectedProperty$.subscribe(property => {
      this.selectedProperty = property;
      this.filterExpenses();
    });
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.dataService.getExpenses().subscribe(expenses => {
      this.expenses = expenses.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.filterExpenses();
    });
  }

  filterExpenses(): void {
    this.filteredExpenses = this.expenses.filter(expense => {
      const matchesProperty = this.selectedProperty === 'All Properties' || 
                             expense.property === this.selectedProperty;
      const matchesCategory = this.filterCategory === 'All' || 
                             expense.category === this.filterCategory;
      const matchesSearch = expense.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesProperty && matchesCategory && matchesSearch;
    });
  }

  onSearchChange(): void {
    this.filterExpenses();
  }

  onCategoryFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterCategory = select.value;
    this.filterExpenses();
  }

  getEmptyExpense(): Expense {
    return {
      property: this.properties[0],
      category: this.categories[0],
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: this.paymentMethods[0]
    };
  }

  openForm(): void {
    this.currentExpense = this.getEmptyExpense();
    this.isEditing = false;
    this.showForm = true;
  }

  editExpense(expense: Expense): void {
    this.currentExpense = { ...expense };
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.currentExpense = this.getEmptyExpense();
  }

  saveExpense(): void {
    if (this.isEditing && this.currentExpense.id) {
      this.dataService.updateExpense(this.currentExpense.id, this.currentExpense)
        .subscribe(() => {
          this.loadExpenses();
          this.closeForm();
        });
    } else {
      this.dataService.addExpense(this.currentExpense).subscribe(() => {
        this.loadExpenses();
        this.closeForm();
      });
    }
  }

  deleteExpense(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this expense?')) {
      this.dataService.deleteExpense(id).subscribe(() => {
        this.loadExpenses();
      });
    }
  }

  getTotalExpense(): number {
    return this.filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  getCategoryTotal(category: string): number {
    return this.filteredExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  }
}