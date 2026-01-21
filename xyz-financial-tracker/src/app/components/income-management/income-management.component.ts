import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Income, PROPERTIES, INCOME_SOURCES, PAYMENT_METHODS } from '../../models/transaction.model';

@Component({
  selector: 'app-income-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income-management.component.html',
  styleUrls: ['./income-management.component.css']
})
export class IncomeManagementComponent implements OnInit {
  incomeList: Income[] = [];
  filteredIncome: Income[] = [];
  
  properties = PROPERTIES;
  sources = INCOME_SOURCES;
  paymentMethods = PAYMENT_METHODS;
  
  selectedProperty: string = 'All Properties';
  searchTerm: string = '';
  filterSource: string = 'All';
  
  showForm: boolean = false;
  isEditing: boolean = false;
  
  currentIncome: Income = this.getEmptyIncome();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.selectedProperty$.subscribe(property => {
      this.selectedProperty = property;
      this.filterIncome();
    });
    this.loadIncome();
  }

  loadIncome(): void {
    this.dataService.getIncome().subscribe(income => {
      this.incomeList = income.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.filterIncome();
    });
  }

  filterIncome(): void {
    this.filteredIncome = this.incomeList.filter(income => {
      const matchesProperty = this.selectedProperty === 'All Properties' || 
                             income.property === this.selectedProperty;
      const matchesSource = this.filterSource === 'All' || 
                           income.source === this.filterSource;
      const matchesSearch = income.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           income.source.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesProperty && matchesSource && matchesSearch;
    });
  }

  onSearchChange(): void {
    this.filterIncome();
  }

  onSourceFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterSource = select.value;
    this.filterIncome();
  }

  getEmptyIncome(): Income {
    return {
      property: this.properties[0],
      source: this.sources[0],
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: this.paymentMethods[0]
    };
  }

  openForm(): void {
    this.currentIncome = this.getEmptyIncome();
    this.isEditing = false;
    this.showForm = true;
  }

  editIncome(income: Income): void {
    this.currentIncome = { ...income };
    this.isEditing = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.currentIncome = this.getEmptyIncome();
  }

  saveIncome(): void {
    if (this.isEditing && this.currentIncome.id) {
      this.dataService.updateIncome(this.currentIncome.id, this.currentIncome)
        .subscribe(() => {
          this.loadIncome();
          this.closeForm();
        });
    } else {
      this.dataService.addIncome(this.currentIncome).subscribe(() => {
        this.loadIncome();
        this.closeForm();
      });
    }
  }

  deleteIncome(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this income entry?')) {
      this.dataService.deleteIncome(id).subscribe(() => {
        this.loadIncome();
      });
    }
  }

  getTotalIncome(): number {
    return this.filteredIncome.reduce((sum, inc) => sum + inc.amount, 0);
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  getSourceTotal(source: string): number {
    return this.filteredIncome
      .filter(i => i.source === source)
      .reduce((sum, i) => sum + i.amount, 0);
  }
}