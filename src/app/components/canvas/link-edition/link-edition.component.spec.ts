import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkEditionComponent } from './link-edition.component';

describe('LinkEditionComponent', () => {
  let component: LinkEditionComponent;
  let fixture: ComponentFixture<LinkEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
