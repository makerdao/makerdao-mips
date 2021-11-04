import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public darkModeService:DarkModeService
  ) { }

  ngOnInit(): void {
  }

}
