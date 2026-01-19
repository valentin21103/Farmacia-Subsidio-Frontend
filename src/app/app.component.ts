import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HealthService } from './services/health.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'subsidio-front';

  backendOnline: boolean = false;
  intervalo: any;

  constructor(private healthService: HealthService) {}

  ngOnInit(): void {

    this.verificarEstado()

    this.intervalo = setInterval(() => {
      this.verificarEstado();
    }, 10000);
  }


    verificarEstado() {
    this.healthService.checkBackend().subscribe({
      next: () => {
        this.backendOnline = true; // 
      },
      error: () => {
        this.backendOnline = false; // 
      }
    });
  }

  ngOnDestroy() {
    // Limpiamos el intervalo si se cierra el componente (buena práctica)
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

}
