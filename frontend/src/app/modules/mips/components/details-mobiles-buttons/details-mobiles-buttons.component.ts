import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-mobiles-buttons',
  templateUrl: './details-mobiles-buttons.component.html',
  styleUrls: ['./details-mobiles-buttons.component.scss']
})
export class DetailsMobilesButtonsComponent implements OnInit {

  showData = -1;
  selected = 1;
  @Input() sourceData;
  @Input() mip;

  constructor(
    private myElement: ElementRef
  ) { }

  ngOnInit(): void {
  }

  updateData(pos: number): void {
    if (this.showData === pos) {
      this.showData = -1;
    } else {
      this.showData = pos;
    }
  }

  updateSelected(pos: number, text: string): void {
    this.selected = pos;
    this.showData = -1;
    if (text !== '') {
      const tag = pos === 1 ? 'h2' : 'p';
      this.findElement(text, tag);
    }
  }

  moveToElement(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  findElement(text: string, tag: string): void {
    const aTags = document.getElementsByTagName(tag);
    let found;

    for (let i = 0; i < aTags.length; i++) {
      if (aTags[i].textContent === text) {
        found = aTags[i];
        break;
      }
    }
    this.moveToElement(found);
  }

}
