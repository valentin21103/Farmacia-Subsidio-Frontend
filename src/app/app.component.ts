import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListaMedicamentosComponent } from './components/lista-medicamentos/lista-medicamentos.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ListaMedicamentosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'subsidio-front';
}
