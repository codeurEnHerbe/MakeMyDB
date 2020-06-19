import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSqlComponent } from './show-sql.component';

describe('ShowSqlComponent', () => {
  let component: ShowSqlComponent;
  let fixture: ComponentFixture<ShowSqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
