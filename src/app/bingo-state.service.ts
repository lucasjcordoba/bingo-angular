import { Injectable, signal, computed, effect } from '@angular/core';

export type PrizeType = 'bingo' | 'linea';
export type BingoMode = 'analogico' | 'digital';

type Prizes = { bingo: string[]; linea: string[] };

const LS = {
  hist: 'historialBingo_ng_v1',
  bg: 'bingo_bg_image_ng_v1',
  title: 'bingo_title_ng_v1',
  prizes: 'bingo_prizes_ng_v1',
  controls: 'bingo_controls_ng_v1',
  presentation: 'bingo_presentation_ng_v1',
  mode: 'bingo_mode_ng_v1', // ✅
};

@Injectable({ providedIn: 'root' })
export class BingoStateService {
  readonly title = signal<string>(this.loadStr(LS.title) ?? 'Bingo! ! ! !');
  readonly bgDataUrl = signal<string | null>(this.loadStr(LS.bg)); // null => default
  readonly controlsVisible = signal<boolean>(this.loadBool(LS.controls, true));
  readonly presentationMode = signal<boolean>(this.loadBool(LS.presentation, false));
  readonly drawerOpen = signal<boolean>(false);

  // ✅ Modo
  readonly mode = signal<BingoMode>(this.loadMode());

  readonly history = signal<string[]>(this.loadHistory());
  readonly prizes = signal<Prizes>(this.loadPrizes());

  readonly lastNumber = computed(() => {
    const h = this.history();
    return h.length ? h[h.length - 1] : '--';
  });

  constructor() {
    effect(() => this.saveStr(LS.title, this.title()));
    effect(() => this.saveBool(LS.controls, this.controlsVisible()));
    effect(() => this.saveBool(LS.presentation, this.presentationMode()));
    effect(() => localStorage.setItem(LS.hist, JSON.stringify(this.history())));
    effect(() => localStorage.setItem(LS.prizes, JSON.stringify(this.prizes())));
    effect(() => localStorage.setItem(LS.mode, this.mode())); // ✅

    // Background -> CSS var
    effect(() => {
      const bg = this.bgDataUrl();
      if (bg === '') {
        document.body.style.setProperty('--bg-image', 'none');
      } else if (bg && bg.startsWith('data:image')) {
        document.body.style.setProperty('--bg-image', `url("${bg}")`);
      } else {
        document.body.style.setProperty('--bg-image', `url("assets/escuela.jpg")`);
      }
    });

    effect(() => {
      document.body.classList.toggle('presentation', this.presentationMode());
    });

    effect(() => {
      document.body.classList.toggle('controls-hidden', !this.controlsVisible());
    });
  }

  pad2(n: number) {
    return String(n).padStart(2, '0');
  }

  sanitize2Digits(value: string): string | null {
    const raw = (value ?? '').replace(/\D/g, '').slice(0, 2);
    if (!raw) return null;
    const num = Math.max(0, Math.min(99, Number(raw)));
    if (Number.isNaN(num)) return null;
    return this.pad2(num);
  }

  mark(num2: string) {
    if (!/^\d{2}$/.test(num2)) return false;
    const v = Number(num2);
    if (v < 0 || v > 99) return false;

    const h = this.history();
    if (h.includes(num2)) return false;

    this.history.set([...h, num2]);
    return true;
  }

  // ✅ Para bolillero digital: lista de candidatos no repetidos
  getRemainingNumbers(): string[] {
    const used = new Set(this.history());
    const out: string[] = [];
    for (let i = 0; i < 100; i++) {
      const n = this.pad2(i);
      if (!used.has(n)) out.push(n);
    }
    return out;
  }

  // ✅ Saca un número al azar (no repetido). Devuelve null si ya salieron todos.
  drawRandom(): string | null {
    const remaining = this.getRemainingNumbers();
    if (!remaining.length) return null;
    const idx = Math.floor(Math.random() * remaining.length);
    const n = remaining[idx];
    const ok = this.mark(n);
    return ok ? n : null; // debería ser ok siempre
  }

  undo() {
    const h = this.history();
    if (!h.length) return null;
    const last = h[h.length - 1];
    this.history.set(h.slice(0, -1));
    return last;
  }

  reset() {
    this.history.set([]);
  }

  setTitle(t: string) {
    const val = (t ?? '').trim();
    if (!val) return;
    this.title.set(val);
    document.title = val;
  }

  resetTitle() {
    localStorage.removeItem(LS.title);
    this.setTitle('Bingo! ! ! !');
  }

  setBgDataUrl(dataUrl: string) {
    this.bgDataUrl.set(dataUrl);
    this.saveStr(LS.bg, dataUrl);
  }

  clearBg() {
    this.bgDataUrl.set('');
    this.saveStr(LS.bg, '');
  }

  defaultBg() {
    this.bgDataUrl.set(null);
    localStorage.removeItem(LS.bg);
  }

  addPrize(type: PrizeType, text: string) {
    const val = (text ?? '').trim();
    if (!val) return;

    const p = this.prizes();
    const next = {
      ...p,
      [type]: [...p[type], val],
    } as Prizes;

    this.prizes.set(next);
  }

  deletePrize(type: PrizeType, idx: number) {
    const p = this.prizes();
    if (idx < 0 || idx >= p[type].length) return;
    const nextArr = p[type].filter((_, i) => i !== idx);
    this.prizes.set({ ...p, [type]: nextArr });
  }

  clearPrizes() {
    this.prizes.set({ bingo: [], linea: [] });
  }

  toggleControls() {
    this.controlsVisible.set(!this.controlsVisible());
  }

  togglePresentation() {
    this.presentationMode.set(!this.presentationMode());
  }

  // ✅
  setMode(m: BingoMode) {
    this.mode.set(m);
  }

  openDrawer() { this.drawerOpen.set(true); }
  closeDrawer() { this.drawerOpen.set(false); }

  // ---- storage helpers ----
  private loadHistory(): string[] {
    try {
      const raw = localStorage.getItem(LS.hist);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.map(String).filter(x => /^\d{2}$/.test(x) && Number(x) >= 0 && Number(x) <= 99);
    } catch { return []; }
  }

  private loadPrizes(): Prizes {
    try {
      const raw = localStorage.getItem(LS.prizes);
      if (!raw) return { bingo: [], linea: [] };
      const obj = JSON.parse(raw);
      return {
        bingo: Array.isArray(obj?.bingo) ? obj.bingo.map(String).map((s: string) => s.trim()).filter(Boolean) : [],
        linea: Array.isArray(obj?.linea) ? obj.linea.map(String).map((s: string) => s.trim()).filter(Boolean) : [],
      };
    } catch {
      return { bingo: [], linea: [] };
    }
  }

  private loadMode(): BingoMode {
    const v = localStorage.getItem(LS.mode);
    return (v === 'digital' || v === 'analogico') ? v : 'analogico';
  }

  private loadStr(key: string): string | null {
    const v = localStorage.getItem(key);
    return v === null ? null : v;
  }

  private saveStr(key: string, value: string | null) {
    if (value === null) return;
    localStorage.setItem(key, value);
  }

  private loadBool(key: string, fallback: boolean): boolean {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === '1';
  }

  private saveBool(key: string, value: boolean) {
    localStorage.setItem(key, value ? '1' : '0');
  }
}
