import { TestBed } from '@angular/core/testing';
import { PageActionsComponent } from './page-actions.component';

describe('PageActionsComponent', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [PageActionsComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(PageActionsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });
});
