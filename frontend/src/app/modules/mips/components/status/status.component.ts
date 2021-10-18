import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
  @Input() type:
    | 'ACCEPTED'
    | 'REJECTED'
    | 'ARCHIVE'
    | 'RFC'
    | 'NONE'
    | 'OBSOLETE'
    | 'FS'
    | 'DEFAULT';
  @Input() value: string;
  @Input() isOnSubproposal?: boolean = false;

  @Input() flag?: boolean = true;
  constructor() {}

  public get classes(): string[] {
    return ['status-container', `type--${this.type}`];
  }

  ngOnInit(): void {}
}
