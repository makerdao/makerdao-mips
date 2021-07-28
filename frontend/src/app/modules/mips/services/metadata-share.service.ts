import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetadataShareService {
  private _title: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public title$: Observable<string> = this._title.asObservable();
  set title(value) {
    this._title.next(value);
  }
  private _description: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );
  public description$: Observable<string> = this._description.asObservable();
  set description(value) {
    this._description.next(value);
  }
  private _image: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public image$: Observable<string> = this._image.asObservable();
  set image(value) {
    this._image.next(value);
  }

  constructor() {}
}
