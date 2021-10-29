import { Injectable } from '@angular/core';

const STORAGE_KEY = 'dark_mode';
@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  darkMode: boolean;

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      this.setDarkMode(stored === 'true');
    } else {
      this.setDarkMode(false);
    }
  }

  getDarkMode(): boolean {
    return this.darkMode;
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.darkMode);
  }

  setDarkMode(newValue: boolean) {
    if (this.darkMode !== newValue) {
      if (newValue) {
        document.body.classList.add('dark-body');
      } else {
        document.body.classList.remove('dark-body');
      }

      localStorage.setItem(STORAGE_KEY, newValue.toString());
      this.darkMode = newValue;
    }
  }
}
