import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  private currentLang: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );
  public currentLang$: Observable<string> = this.currentLang.asObservable();
  lang: string = '';

  constructor() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.setCurrentLang(savedLanguage, false);
    }
  }

  setCurrentLang(value: string, saveToLocalStorage = true) {
    if (saveToLocalStorage) {
      localStorage.setItem('language', value);
    }

    this.lang = value;
    this.currentLang.next(value);
  }
}
