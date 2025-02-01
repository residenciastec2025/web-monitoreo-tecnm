import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsUploadListComponent } from './students-upload-list.component';

describe('StudentsUploadListComponent', () => {
  let component: StudentsUploadListComponent;
  let fixture: ComponentFixture<StudentsUploadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsUploadListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsUploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
