import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-mobiles-buttons',
  templateUrl: './details-mobiles-buttons.component.html',
  styleUrls: ['./details-mobiles-buttons.component.scss']
})
export class DetailsMobilesButtonsComponent implements OnInit {

  showData = -1;
  selected = 1;

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

  updateSelected(pos: number): void {
    this.selected = pos;
    this.showData = -1;
    this.scrollToStudio();
  }

  scrollToStudio(): void {
    const el = this.myElement.nativeElement.querySelector('#details-component');
    if (el !== null) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

}
