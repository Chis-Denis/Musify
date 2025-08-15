import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsProfileComponent } from './artists-profile.component';

describe('ArtistsProfileComponent', () => {
  let component: ArtistsProfileComponent;
  let fixture: ComponentFixture<ArtistsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistsProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
