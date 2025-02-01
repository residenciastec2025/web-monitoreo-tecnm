import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsDownloadListComponent } from './students-download-list.component';

describe('StudentsDownloadListComponent', () => {
  let component: StudentsDownloadListComponent;
  let fixture: ComponentFixture<StudentsDownloadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsDownloadListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsDownloadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
