import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  public showFeedbackDialog: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public showFeedbackDialog$: Observable<
    boolean
  > = this.showFeedbackDialog.asObservable();

  constructor() {}
}
