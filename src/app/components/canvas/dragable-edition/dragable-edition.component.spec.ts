import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragableEditionComponent } from './dragable-edition.component';

describe('EntityEditionComponent', () => {
  let component: DragableEditionComponent;
  let fixture: ComponentFixture<DragableEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragableEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragableEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
