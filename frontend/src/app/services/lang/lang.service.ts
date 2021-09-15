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

  constructor() {}

  setCurrentLang(value: string) {
    this.lang = value;
    this.currentLang.next(value);
  }
}
