import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

  @Input() githubLink: 'OK';
  @Input() forumLink: 'OK';
  gitgubUrl = environment.repoUrl;

  constructor() { }

  ngOnInit(): void {
  }

}
