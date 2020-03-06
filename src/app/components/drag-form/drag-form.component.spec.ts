import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragFormComponent } from './drag-form.component';

describe('DragFormComponent', () => {
  let component: DragFormComponent;
  let fixture: ComponentFixture<DragFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
