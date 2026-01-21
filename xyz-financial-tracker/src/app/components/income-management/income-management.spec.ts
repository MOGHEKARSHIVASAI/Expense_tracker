import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeManagement } from './income-management';

describe('IncomeManagement', () => {
  let component: IncomeManagement;
  let fixture: ComponentFixture<IncomeManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
