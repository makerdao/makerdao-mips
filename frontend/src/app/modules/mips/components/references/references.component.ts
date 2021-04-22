import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss'],
})
export class ReferencesComponent implements OnInit {
  @Input() references: any[];

  constructor() {}

  ngOnInit(): void {
    let referencesTemp: any[] = this.references.filter((item) => {
      return item.name !== '\n';
    });

    this.references = [...referencesTemp];
  }
}
