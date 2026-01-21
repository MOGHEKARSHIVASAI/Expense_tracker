import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Expense, Income, DashboardStats, TimePeriod } from '../../models/transaction.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    earthyEscapeIncome: 0,
    earthyEscapeExpense: 0,
    millenniumIncome: 0,
    millenniumExpense: 0
  };

  selectedProperty: string = 'All Properties';
  timePeriod: TimePeriod = 'monthly';
  
  expenses: Expense[] = [];
  income: Income[] = [];
  
  recentTransactions: any[] = [];
  
  chartData: { month: string; income: number; expense: number }[] = [];

  constructor(private dataService: DataService) {
    console.log('DashboardComponent initialized');
  }

  ngOnInit(): void {
    console.log('Dashboard ngOnInit called');
    
    this.dataService.selectedProperty$.subscribe(property => {
      console.log('Property changed to:', property);
      this.selectedProperty = property;
      this.calculateStats();
      this.loadRecentTransactions();
    });
    
    this.loadData();
  }

  loadData(): void {
    console.log('Loading data...');
    
    combineLatest([
      this.dataService.getExpenses(),
      this.dataService.getIncome()
    ]).subscribe({
      next: ([expenses, income]) => {
        console.log('Expenses loaded:', expenses);
        console.log('Income loaded:', income);
        
        this.expenses = expenses;
        this.income = income;
        this.calculateStats();
        this.loadRecentTransactions();
        this.generateChartData();
      },
      error: (error) => {
        console.error('Error loading data:', error);
        alert('Failed to load data. Make sure JSON Server is running on port 3000');
      }
    });
  }

  calculateStats(): void {
    console.log('Calculating stats for period:', this.timePeriod);
    
    const filteredExpenses = this.filterByPeriod(this.expenses);
    const filteredIncome = this.filterByPeriod(this.income);

    console.log('Filtered expenses:', filteredExpenses.length);
    console.log('Filtered income:', filteredIncome.length);

    if (this.selectedProperty === 'All Properties') {
      this.stats.totalExpense = this.sumAmount(filteredExpenses);
      this.stats.totalIncome = this.sumAmount(filteredIncome);
      
      this.stats.earthyEscapeExpense = this.sumAmount(
        filteredExpenses.filter(e => e.property === 'Earthy Escape')
      );
      this.stats.earthyEscapeIncome = this.sumAmount(
        filteredIncome.filter(i => i.property === 'Earthy Escape')
      );
      this.stats.millenniumExpense = this.sumAmount(
        filteredExpenses.filter(e => e.property === 'Millennium Farm House')
      );
      this.stats.millenniumIncome = this.sumAmount(
        filteredIncome.filter(i => i.property === 'Millennium Farm House')
      );
    } else {
      const propertyExpenses = filteredExpenses.filter(
        e => e.property === this.selectedProperty
      );
      const propertyIncome = filteredIncome.filter(
        i => i.property === this.selectedProperty
      );
      
      this.stats.totalExpense = this.sumAmount(propertyExpenses);
      this.stats.totalIncome = this.sumAmount(propertyIncome);
    }

    this.stats.netProfit = this.stats.totalIncome - this.stats.totalExpense;
    
    console.log('Stats calculated:', this.stats);
  }

  filterByPeriod<T extends { date: string }>(items: T[]): T[] {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3);

    return items.filter(item => {
      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear();
      const itemMonth = itemDate.getMonth();
      const itemQuarter = Math.floor(itemMonth / 3);

      switch (this.timePeriod) {
        case 'monthly':
          return itemYear === currentYear && itemMonth === currentMonth;
        case 'quarterly':
          return itemYear === currentYear && itemQuarter === currentQuarter;
        case 'yearly':
          return itemYear === currentYear;
        default:
          return true;
      }
    });
  }

  sumAmount(items: { amount: number }[]): number {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }

  loadRecentTransactions(): void {
    const allTransactions = [
      ...this.expenses.map(e => ({ ...e, type: 'Expense' })),
      ...this.income.map(i => ({ ...i, type: 'Income', category: i.source }))
    ];

    this.recentTransactions = allTransactions
      .filter(t => this.selectedProperty === 'All Properties' || t.property === this.selectedProperty)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
      
    console.log('Recent transactions:', this.recentTransactions);
  }

  generateChartData(): void {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    this.chartData = months.map((month, index) => {
      const monthExpenses = this.expenses.filter(e => {
        const date = new Date(e.date);
        return date.getMonth() === index && 
               date.getFullYear() === currentYear &&
               (this.selectedProperty === 'All Properties' || e.property === this.selectedProperty);
      });
      
      const monthIncome = this.income.filter(i => {
        const date = new Date(i.date);
        return date.getMonth() === index && 
               date.getFullYear() === currentYear &&
               (this.selectedProperty === 'All Properties' || i.property === this.selectedProperty);
      });

      return {
        month,
        income: this.sumAmount(monthIncome),
        expense: this.sumAmount(monthExpenses)
      };
    });
    
    console.log('Chart data generated:', this.chartData);
  }

  setTimePeriod(period: TimePeriod): void {
    console.log('Setting time period to:', period);
    this.timePeriod = period;
    this.calculateStats();
    this.loadRecentTransactions();
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  exportReport(): void {
    const report = {
      property: this.selectedProperty,
      period: this.timePeriod,
      stats: this.stats,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${Date.now()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}