import { Injectable, signal } from '@angular/core';

export type ThemeName = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  theme = signal<ThemeName>(this.getStoredTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  private getStoredTheme(): ThemeName {
    const stored = localStorage.getItem('inklink-theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    // se l'utente non ha mai scelto, rispetta la preferenza di sistema
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: ThemeName): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggle(): void {
    const next: ThemeName = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    localStorage.setItem('inklink-theme', next);
    this.applyTheme(next);
  }
}
