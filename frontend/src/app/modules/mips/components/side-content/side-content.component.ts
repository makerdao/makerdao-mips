import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-content',
  templateUrl: './side-content.component.html',
  styleUrls: ['./side-content.component.scss']
})
export class SideContentComponent implements OnInit {
  @Input() content: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
