import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
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
  @ViewChild(FilterListHostDirective, { static: true })
  appFilterListHost: FilterListHostDirective;
  itemsRef: ComponentRef<FilterListItemComponent>[] = [];
  items: any[] = [];
  @Input() compareFn: (o1: any, o2: any) => boolean;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private filterItemService: FilterItemService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.filterItemService.newItem.subscribe((data) => {
      if (!this.exists(data)) {
        this.itemsRef.push(this.addItem(data));
        this.items.push(data);
      }
    });

    this.filterItemService.itemToRemove.subscribe((data) => {
      let index = this.itemsRef.findIndex((i) => i.instance.id === data);

      if (index !== -1) {
        this.itemsRef[index].instance.close();
        this.itemsRef.splice(index, 1);
        this.items.splice(index, 1);
      }
    });
  }

  addItem(data): ComponentRef<FilterListItemComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      FilterListItemComponent
    );
    const viewContainerRef = this.appFilterListHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent<
      FilterListItemComponent
    >(componentFactory);
    componentRef.instance.id = data.id;
    componentRef.instance.text = data.text;
    componentRef.instance.color = data.color;
    componentRef.instance.selfRef = componentRef;

    return componentRef;
  }

  exists(o: any): boolean {
    let found = false;
    for (let index = 0; index < this.items.length && !found; index++) {
      if (this.compareFn) {
        found = this.compareFn(this.items[index], o);
      } else {
        found = this.compare(this.items[index], o);
      }
    }

    return found;
  }

  compare(o1: any, o2: any): boolean {
    return o1.id === o2.id;
  }
}
