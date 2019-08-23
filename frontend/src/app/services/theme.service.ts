import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() {
  }

  theme: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('theme'));
  themes: Array<string> = [
    'dark-theme',
    'light-theme'
  ];

  initTheme(): void {
    if (!localStorage.getItem('theme')) {
      this.setTheme(this.themes[0]);
      this.theme.next(this.getTheme());
    } else {
      this.theme.next(this.getTheme());
    }
  }

  getTheme(): string {
    return localStorage.getItem('theme').replace(/"/g, '');
  }

  setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
    this.theme.next(theme);
  }
}
