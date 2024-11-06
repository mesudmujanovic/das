import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssociationDeleteComponent } from './association-delete.component';

describe('AssociationDeleteComponent', () => {
  let component: AssociationDeleteComponent;
  let fixture: ComponentFixture<AssociationDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
