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
  sections: any;
  pullrequest: any;
  mipId: string;
  mipPosition: number;
  total: number;

  constructor(
    private mipsService: MipsService,
    private activedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.mipId = paramMap.get('id');
        this.total = this.mipsService.getTotal();
        this.loadData();
        this.mipsService.updateActiveSearch(true);
      }
    });
  }

  loadData(): void {
    this.mipsService.getMip(this.mipId)
    .subscribe(data => {
      this.mip = data[0];
      const regEx = new RegExp('(.)*');
      this.mip.file = this.mip.file.replace(regEx, ' ');
      this.sections = data[1];
    });
    this.mipsService.getPullRequestHistory()
    .subscribe(response => {
      this.pullrequest = response;
    });
    const data = this.mipsService.getMipsData();
    if (data !== undefined) {
      this.mipPosition = data.findIndex(item => item._id === this.mipId);
    }
  }

  mipsPagination(position: number): void {
    const data = this.mipsService.getMipsData();
    this.mipId = data[position]._id;
    this.loadData();
  }

}
