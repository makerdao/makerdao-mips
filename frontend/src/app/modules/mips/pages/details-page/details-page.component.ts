import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MipsService } from '../../services/mips.service';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss']
})
export class DetailsPageComponent implements OnInit {

  mip: any;

  constructor(
    private mipsService: MipsService,
    private activedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.mipsService.getMip(paramMap.get('id'))
        .subscribe(data => {
          this.mip = data;
        });
      }
    });
  }

}
