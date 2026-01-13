import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';
import { TutorialModalComponent } from './tutorial-modal.component';

import { BingoStateService, PrizeType } from './bingo-state.service';
import { ShortcutsService } from './shortcuts.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TutorialModalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    public state: BingoStateService,
    private _shortcuts: ShortcutsService,
  ) {}

  overlayNumber = signal<string | null>(null);
  eventText = signal<{ text: string; kind: 'bingo' | 'linea' } | null>(null);
  tutorialOpen = signal<boolean>(true);
  
  // ✅ Bolillero UI
  rolling = signal<boolean>(false);
  rollingDisplay = signal<string>('00'); // lo que se ve mientras “gira”

  private audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-small-group-cheer-and-applause-518.mp3');

  ngOnInit(): void {
    document.title = this.state.title();

    (window as any).__bingo = () => this.showBingo();
    (window as any).__linea = () => this.showLinea();
    (window as any).__girar = () => this.girar(); // ✅ atajo Enter en digital
  }

  toggleDrawer() {
    this.state.drawerOpen() ? this.state.closeDrawer() : this.state.openDrawer();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  onMarkFromValue(value: string) {
    const n = this.state.sanitize2Digits(value);
    if (!n) return false;
    const ok = this.state.mark(n);
    if (ok) this.flashNumber(n);
    return ok;
  }

  onClickCell(n: string) {
    const ok = this.state.mark(n);
    if (ok) this.flashNumber(n);
  }

  undo() {
    this.state.undo();
  }

  reset() {
    this.state.reset();
  }

  addPrizeFromSelect(selectValue: string, prizeText: string) {
    const type = this.toPrizeType(selectValue);
    if (!type) return;
    this.state.addPrize(type, prizeText);
  }

  private toPrizeType(v: string): PrizeType | null {
    return (v === 'bingo' || v === 'linea') ? v : null;
  }

  // ✅ Bolillero digital
  girar() {
    if (this.state.mode() !== 'digital') return;
    if (this.rolling()) return;

    const remaining = this.state.getRemainingNumbers();
    if (!remaining.length) {
      this.eventText.set({ text: '¡No quedan números!', kind: 'linea' });
      setTimeout(() => this.eventText.set(null), 1500);
      return;
    }

    this.rolling.set(true);

    // animación simple tipo “roulette”: cambia rápido el número mostrado
    const start = Date.now();
    const duration = 1200; // ms
    const interval = 40;   // ms

    const timer = setInterval(() => {
      const t = Date.now() - start;
      const r = Math.floor(Math.random() * 100);
      this.rollingDisplay.set(this.state.pad2(r));

      if (t >= duration) {
        clearInterval(timer);

        // al final, sacar un número REAL no repetido
        const n = this.state.drawRandom();
        if (n) {
          this.rollingDisplay.set(n);
          this.flashNumber(n);
        }
        this.rolling.set(false);
      }
    }, interval);
  }

  showLinea() {
    this.eventText.set({ text: '¡Línea!', kind: 'linea' });
    setTimeout(() => this.eventText.set(null), 1500);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      scalar: 0.9,
      ticks: 70,
      zIndex: 1000
    });
  }

  showBingo() {
    try { this.audio.currentTime = 0; this.audio.play(); } catch {}

    this.eventText.set({ text: 'BINGO!', kind: 'bingo' });
    setTimeout(() => this.eventText.set(null), 1500);

    const duration = 3000;
    const end = Date.now() + duration;
    const defaults = {
      origin: { y: 0.5 },
      spread: 360,
      startVelocity: 45,
      scalar: 1.2,
      ticks: 120,
      zIndex: 1000
    };

    const interval = setInterval(() => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      confetti({ ...defaults, particleCount: 12, angle: 60 });
      confetti({ ...defaults, particleCount: 12, angle: 120 });
    }, 200);
  }

  private flashNumber(n: string) {
    this.overlayNumber.set(n);
    setTimeout(() => this.overlayNumber.set(null), 1500);
  }

  async onBgFileSelected(file: File | null) {
    if (!file || !file.type.startsWith('image/')) return;
    const dataUrl = await this.readFileAsDataUrl(file);
    try {
      this.state.setBgDataUrl(dataUrl);
    } catch {
      alert('La imagen es muy pesada. Probá con una más liviana.');
    }
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }
}
