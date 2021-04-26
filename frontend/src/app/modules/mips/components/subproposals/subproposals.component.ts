import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-subproposals',
  templateUrl: './subproposals.component.html',
  styleUrls: ['./subproposals.component.scss'],
})
export class SubproposalsComponent implements OnInit {
  @Input() subproposals: any[] = [];
  constructor() {}

  ngOnInit(): void {}
}
