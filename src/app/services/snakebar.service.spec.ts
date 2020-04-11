import { TestBed } from '@angular/core/testing';

import { SnakebarService } from './snakebar.service';

describe('SnakebarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnakebarService = TestBed.get(SnakebarService);
    expect(service).toBeTruthy();
  });
});
