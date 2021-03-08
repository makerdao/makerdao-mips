import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FilterItemService } from '../../../../services/filter-item/filter-item.service';
import { FilterListItemComponent } from '../filter-list-item/filter-list-item.component';
import { FilterListHostDirective } from '../../directives/filter-list-host.directive';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss'],
})
export class FilterListComponent implements OnInit, AfterViewInit {
  @ViewChild(FilterListHostDirective, {static: true}) appFilterListHost: FilterListHostDirective;

  // color: string = 'red';
  // items: any[] = [
  //   {text: 'rfc', color: '#F2994A'},
  //   {text: 'archive', color: '#748AA1'},
  //   {text: 'accepted', color: '#27AE60'},
  //   {text: 'rejected', color: '#EB5757'},
  // ];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private filterItemService: FilterItemService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.filterItemService.newItem.subscribe((data) => {
      this.addItem(data);
    });
  }

  addItem(data) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      FilterListItemComponent
    );
    const viewContainerRef = this.appFilterListHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent<
      FilterListItemComponent
    >(componentFactory);
    componentRef.instance.text = data.text;
    componentRef.instance.color = data.color;
    componentRef.instance.selfRef = componentRef;
  }
}
