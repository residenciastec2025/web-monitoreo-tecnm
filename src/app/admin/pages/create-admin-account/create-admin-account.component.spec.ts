import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdminAccountComponent } from './create-admin-account.component';

describe('CreateAdminAccountComponent', () => {
  let component: CreateAdminAccountComponent;
  let fixture: ComponentFixture<CreateAdminAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAdminAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAdminAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
