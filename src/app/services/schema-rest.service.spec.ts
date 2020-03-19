import { TestBed } from '@angular/core/testing';

import { SchemaRestService } from './schema-rest.service';

describe('SchemaRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchemaRestService = TestBed.get(SchemaRestService);
    expect(service).toBeTruthy();
  });
});
