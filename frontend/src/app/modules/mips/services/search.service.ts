import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public search = new BehaviorSubject<string>(null);
  public search$ = this.search.asObservable();

  constructor() { }
}
