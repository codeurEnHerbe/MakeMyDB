import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityEditionComponent } from './entity-edition.component';

describe('EntityEditionComponent', () => {
  let component: EntityEditionComponent;
  let fixture: ComponentFixture<EntityEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
