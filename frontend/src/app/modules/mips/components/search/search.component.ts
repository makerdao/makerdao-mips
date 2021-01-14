import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {

@Input() placeHolder ? = 'Search on the list';
@Input() imageDir ? = '../../../../../assets/images/magnifier.png';
@Output() send = new EventEmitter();
timeout: any = null;

  constructor() { }

  ngOnInit(): void {}

  onKeySearch(event: any): void {
    clearTimeout(this.timeout);
    const $this = this;
    this.timeout = setTimeout(() => {
        $this.onChange(event.target.vlue);
    }, 1000);
  }

  onChange(value: string): void {
    this.send.emit(value);
  }
}
