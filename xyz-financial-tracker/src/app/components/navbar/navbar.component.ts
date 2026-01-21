import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { PROPERTIES } from '../../models/transaction.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  properties = ['All Properties', ...PROPERTIES];
  selectedProperty: string = 'All Properties';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.selectedProperty$.subscribe(property => {
      this.selectedProperty = property;
    });
  }

  onPropertyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.dataService.setSelectedProperty(select.value);
  }
}