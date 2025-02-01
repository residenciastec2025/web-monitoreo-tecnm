import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherUpdateCareerComponent } from './teacher-update-career.component';

describe('TeacherUpdateCareerComponent', () => {
  let component: TeacherUpdateCareerComponent;
  let fixture: ComponentFixture<TeacherUpdateCareerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherUpdateCareerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherUpdateCareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
