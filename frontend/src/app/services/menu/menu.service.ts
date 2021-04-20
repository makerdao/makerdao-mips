import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  url: string = 'assets/data/menu.json';

  constructor(private http: HttpClient) {}

  getMenu() {
    return this.http.get(this.url);
  }
}
