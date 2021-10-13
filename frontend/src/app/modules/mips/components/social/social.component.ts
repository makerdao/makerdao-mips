import { Component, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent  {

  @Input() githubLink: string;
  @Input() forumLink: string;
  @Input() votingPortalLink: string;
  gitHubUrl = environment.repoUrl;
  @Input() mobile = false;

  constructor() { }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

}
