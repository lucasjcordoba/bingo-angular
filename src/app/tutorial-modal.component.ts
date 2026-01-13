import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BingoMode } from './bingo-state.service';

@Component({
  selector: 'app-tutorial-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tutorial-backdrop" (click)="close.emit()"></div>

    <section class="tutorial-modal" role="dialog" aria-modal="true" aria-label="Instructivo de uso">
      <header class="tutorial-header">
        <div>
          <div class="tutorial-title">Instructivo de uso</div>
          <div class="tutorial-subtitle">Guía rápida para operar el bingo</div>
        </div>

        <button class="tutorial-close" type="button" (click)="close.emit()" aria-label="Cerrar">✕</button>
      </header>

      <div class="tutorial-body">
        <p class="tutorial-intro">
          Esta app tiene dos modos: <strong>Analógico</strong> (manual) y <strong>Bolillero Digital</strong> (automático).
          Elegí el modo desde el menú hamburguesa.
        </p>

        <div class="tutorial-section">
          <div class="tutorial-h">1) Inicio</div>
          <ul>
            <li>Abrí la app y, si vas a proyectar, activá <strong>Pantalla completa</strong>.</li>
            <li>Desde el menú, podés cambiar el <strong>título</strong> y el <strong>fondo</strong>.</li>
          </ul>
        </div>

        <div class="tutorial-section">
          <div class="tutorial-h">2) Modo Analógico (manual)</div>
          <ul>
            <li>Ingresá el número que salió (00–99) y confirmá.</li>
            <li>El número se marca en el tablero, queda en <strong>Último</strong> y en el <strong>historial</strong>.</li>
          </ul>
        </div>

        <div class="tutorial-section">
          <div class="tutorial-h">3) Modo Bolillero Digital (automático)</div>
          <ul>
            <li>Usá el botón <strong>Girar</strong> o la tecla <strong>Enter</strong>.</li>
            <li>Los números salen <strong>sin repetirse</strong> y se marcan solos.</li>
          </ul>
        </div>

        <div class="tutorial-section">
          <div class="tutorial-h">4) Eventos</div>
          <ul>
            <li><strong>Línea</strong> y <strong>Bingo</strong> muestran animación/sonido, no modifican el tablero.</li>
          </ul>
        </div>
      </div>

      <footer class="tutorial-footer">
        <button class="btn btn--primary" type="button" (click)="close.emit()">Entendido</button>
      </footer>
    </section>
  `,
})
export class TutorialModalComponent {
  @Input() mode: BingoMode = 'analogico';
  @Output() close = new EventEmitter<void>();
}