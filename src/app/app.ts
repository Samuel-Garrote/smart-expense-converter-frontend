import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { ExpenseService } from './services/expense.service';

@Component({
  imports: [ReactiveFormsModule], // Permite usar el formulario
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  // Controla el texto que escribe el usuario.
  protected readonly input = new FormControl('');

  // Guarda el resultado que mostramos en pantalla.
  protected readonly result = signal('');

  // Se pone a true si la última petición falló.
  protected readonly hasError = signal(false);

  constructor(private expenseService: ExpenseService) {
    // Detecta cuando cambia el texto.
    this.input.valueChanges
      .pipe(
        // Espera 500 ms antes de continuar.
        debounceTime(500),

        // Envía el texto al backend.
        switchMap((text) =>
          this.expenseService.convert(text ?? '').pipe(
            // Si esta petición en concreto falla, lo atrapamos AQUÍ DENTRO
            // (no fuera), para que solo falle esta llamada y el input
            // siga funcionando con lo próximo que escribas.
            catchError(() => {
              this.hasError.set(true);
              return of(null);
            }),
          ),
        ),

        // Limpia la suscripción al destruir el componente.
        takeUntilDestroyed(),
      )

      // Cuando llega la respuesta, guardamos el mensaje.
      // Si "response" es null, es que catchError atrapó un fallo arriba.
      .subscribe((response) => {
        if (response) {
          this.hasError.set(false);
          this.result.set(response.message);
        }
      });
  }
}
