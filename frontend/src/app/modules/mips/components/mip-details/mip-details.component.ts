import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MipsService } from '../../services/mips.service';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-mip-details',
  templateUrl: './mip-details.component.html',
  styleUrls: ['./mip-details.component.scss']
})
export class MipDetailsComponent implements OnInit, OnChanges {

  @Input() status: string;
  @Input() dateProposed: string;
  @Input() dateRatified: string;
  @Input() ratifiedDataLink:string;
  @Input() mipName: string;
  @Input() title: string;
  @Input() authors: string[];
  @Input() contributors: string[];
  @Input() type: string;
  @Input() lastOpened: string;
  @Input() dependencies: string[];
  @Input() replaces: string;
  @Input() pollAddress: string;
  @Input() tags: string[];
  @Input() darkMode: boolean;

  deps = [];

  constructor(private statusService: StatusService, private mipsService: MipsService) { }

  ngOnInit(): void {
  }

  getStatusValue(data: string): string {
    return this.statusService.getStatusValue(data);
  }

  getStatusType(data: string): string {
    return this.statusService.getStatusType(data);
  }

  isEmptyWhenReduce(array: string[]): boolean {
    let str: string;
    if (array && array.length > 0) {
      str = array.reduce((c, t) => {
        return (t as string).concat(c);
      });
    }

    return !str ? true : false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dependencies?.currentValue?.length) {
      const deps = this.dependencies.filter(dep => dep !== 'n/a' && dep !== 'None')
      if (deps.length) {
        this.mipsService.checkDependencies(deps)
        .subscribe(data => {
          this.deps = deps.map(dep => ({
            exists: !!data.items.find(m => m.mipName === dep),
            link: `/mips/details/${dep.replace('-', '')}`,
            dep
          }))
        })
      } else {
        this.deps = [];
      }
    } else {
      this.deps = [];
    }
  }

}
