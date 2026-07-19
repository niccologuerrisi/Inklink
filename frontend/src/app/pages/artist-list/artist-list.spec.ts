import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ArtistList } from './artist-list';

describe('ArtistList', () => {
  let component: ArtistList;
  let fixture: ComponentFixture<ArtistList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
