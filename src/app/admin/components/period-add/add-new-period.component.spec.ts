import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPeriodComponent } from './add-new-period.component';

describe('AddNewPeriodComponent', () => {
  let component: AddNewPeriodComponent;
  let fixture: ComponentFixture<AddNewPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPeriodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
