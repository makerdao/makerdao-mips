import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IFilter from '../types/filter';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public filter = new BehaviorSubject<IFilter>(null);
  public filter$ = this.filter.asObservable();

  constructor() { }
}
