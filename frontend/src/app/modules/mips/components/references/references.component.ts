import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss']
})
export class ReferencesComponent implements OnInit {
  @Input() references: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
