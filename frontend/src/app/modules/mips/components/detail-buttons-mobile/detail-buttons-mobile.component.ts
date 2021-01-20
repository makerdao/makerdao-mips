import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-buttons-mobile',
  templateUrl: './detail-buttons-mobile.component.html',
  styleUrls: ['./detail-buttons-mobile.component.scss']
})
export class DetailButtonsMobileComponent implements OnInit {

  showProposal = false;
  showOptions = false;

  constructor() { }

  ngOnInit(): void {
  }

}
