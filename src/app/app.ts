import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { ExpenseService } from './services/expense.service';
//Esperamos 500ms de silencio con debounceTime, con el switchMap enviamos ese texto al backend
//(cancelando cualquier petición anterior si el usuario ha seguido escribiendo),
// y si la respuesta llega bien la guardamos en result, si falla marcamos hasError.
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
        debounceTime(2000),
        switchMap((text) =>
          this.expenseService.convert(text ?? '').pipe(
            catchError(() => {
              this.hasError.set(true);
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        if (response) {
          this.hasError.set(false);
          this.result.set(response.message);
        }
      });
  }
}
