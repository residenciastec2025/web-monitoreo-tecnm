import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsUploadFileComponent } from './subjects-upload-file.component';

describe('SubjectsUploadFileComponent', () => {
  let component: SubjectsUploadFileComponent;
  let fixture: ComponentFixture<SubjectsUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsUploadFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectsUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
