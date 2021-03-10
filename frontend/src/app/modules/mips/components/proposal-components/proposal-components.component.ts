import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-proposal-components',
  templateUrl: './proposal-components.component.html',
  styleUrls: ['./proposal-components.component.scss']
})
export class ProposalComponentsComponent implements OnInit {

  @Input() sourceData;
  marketPosition = 98;
  selectedItem = 0;
  position = 0;
  constructor() { }
  ngOnInit(): void {
  }

  updatePos(index, text): void {
    this.marketPosition = (index) * 31 + 95;
    this.selectedItem = index;
    this.findElement(text);
  }

  moveToElement(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  findElement(text: string): void {
    let aTags = document.getElementsByTagName('h2');
    let found: any = false;

    for (let i = 0; i < aTags.length; i++) {
      if (aTags[i].textContent.includes(text)) {
        found = aTags[i];
        break;
      }
    }

    if (!found) {
      aTags = document.getElementsByTagName('h3');
      for (let i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent.includes(text)) {
          found = aTags[i];
          break;
        }
      }
    }
    this.moveToElement(found);
  }

}
