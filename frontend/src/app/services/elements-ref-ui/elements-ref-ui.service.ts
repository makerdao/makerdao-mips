import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElementsRefUiService {
  private _containerRef: ElementRef;

  get containerRef() {
    return this._containerRef;
  }

  set containerRef(value: ElementRef) {
    this._containerRef = value;
  }

  constructor() { }
}
