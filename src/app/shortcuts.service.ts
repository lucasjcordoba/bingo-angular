import { Injectable } from '@angular/core';
import { BingoStateService } from './bingo-state.service';

@Injectable({ providedIn: 'root' })
export class ShortcutsService {
  constructor(private state: BingoStateService) {
    window.addEventListener('keydown', (e) => this.onKeyDown(e), { passive: false });
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.state.drawerOpen()) {
      if (e.key === 'Escape') this.state.closeDrawer();
      return;
    }

    const active = document.activeElement as HTMLElement | null;
    const tag = active?.tagName?.toUpperCase();
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || (active as any)?.isContentEditable;

    // si el usuario está tipeando en algún input/textarea, no dispares atajos globales
    if (typing) return;

    const k = e.key;

    if (k === 'b' || k === 'B') (window as any).__bingo?.();
    if (k === 'l' || k === 'L') (window as any).__linea?.();
    if (k === 'r' || k === 'R') this.state.reset();
    if (k === 'p' || k === 'P') this.state.togglePresentation();

    // ✅ Enter en modo digital = girar
    if (k === 'Enter' && this.state.mode() === 'digital') {
      e.preventDefault();
      (window as any).__girar?.();
    }

    // ✅ I solo en analógico (foco input)
    if ((k === 'i' || k === 'I') && this.state.mode() === 'analogico') {
      const id = this.state.presentationMode() ? 'numeroPresent' : 'numero';
      const el = document.getElementById(id) as HTMLInputElement | null;
      el?.focus();
      el?.select?.();
    }
  }
}
