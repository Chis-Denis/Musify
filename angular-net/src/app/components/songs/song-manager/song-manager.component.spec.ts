import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongManagerComponent } from './song-manager.component';

describe('SongManagerComponent', () => {
  let component: SongManagerComponent;
  let fixture: ComponentFixture<SongManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
