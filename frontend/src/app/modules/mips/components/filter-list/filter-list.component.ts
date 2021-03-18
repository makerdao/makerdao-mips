import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FilterItemService } from '../../../../services/filter-item/filter-item.service';
import { FilterListItemComponent } from '../filter-list-item/filter-list-item.component';
import { FilterListHostDirective } from '../../directives/filter-list-host.directive';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss'],
})
export class FilterListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(FilterListHostDirective, { static: true })
  appFilterListHost: FilterListHostDirective;
  itemsRef: ComponentRef<FilterListItemComponent>[] = [];
  items: any[] = [];
  @Input() compareFn: (o1: any, o2: any) => boolean;
  @Output() closedItem: Subject<any> = new Subject<any>();
  @Output() hasItems: Subject<boolean> = new Subject<boolean>();
  get length() {
    return this.items.length;
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private filterItemService: FilterItemService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.filterItemService.newItem.subscribe((data) => {
      if (!this.exists(data)) {
        let elem = this.addItem(data);
        this.itemsRef.push(elem);
        this.items.push(data);
        this.hasItems.next(true);
        elem.instance.closed.subscribe((data) => {
          this.closedItem.next(data);
          this.removeItemFromSelfClose(data);
        });
      }
    });

    this.filterItemService.itemToRemove.subscribe((id) => {
      this.removeItemFromExternalClose(id);
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
    componentRef.instance.value = data.value;
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

  removeItemFromSelfClose(id): void {
    let index = this.itemsRef.findIndex((i) => i.instance.id === id);

    if (index !== -1) {
      this.itemsRef.splice(index, 1);
      this.items.splice(index, 1);
      if (!this.itemsRef.length) {
        this.hasItems.next(false);
      }
    }
  }

  removeItemFromExternalClose(id): void {
    let index = this.itemsRef.findIndex((i) => i.instance.id === id);

    if (index !== -1) {
      this.itemsRef[index].instance.destroy();
      this.itemsRef.splice(index, 1);
      this.items.splice(index, 1);
      if (!this.itemsRef.length) {
        this.hasItems.next(false);
      }
    }
  }

  ngOnDestroy() {
    let size = this.itemsRef.length;
    this.itemsRef.splice(0, size);
    this.items.splice(0, size);
  }
}
