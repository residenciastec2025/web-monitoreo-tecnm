import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTeachingHistoryComponent } from './group-teaching-history.component';

describe('GroupTeachingHistoryComponent', () => {
  let component: GroupTeachingHistoryComponent;
  let fixture: ComponentFixture<GroupTeachingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupTeachingHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupTeachingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
