import { Component } from '@angular/core';
import { BeneficiosComponent } from './features/beneficios/beneficios.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BeneficiosComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
}
