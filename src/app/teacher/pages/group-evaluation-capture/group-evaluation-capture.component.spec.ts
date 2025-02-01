import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEvaluationCaptureComponent } from './group-evaluation-capture.component';

describe('GroupEvaluationCaptureComponent', () => {
  let component: GroupEvaluationCaptureComponent;
  let fixture: ComponentFixture<GroupEvaluationCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupEvaluationCaptureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupEvaluationCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
