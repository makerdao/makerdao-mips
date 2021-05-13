import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, labelKey?: string) {
    // console.log('pipe items', items);
    // console.log('pipe searchTerm', searchTerm);

    if (!items || !searchTerm) {
      // console.log('!items || !searchTerm');

      return items;
    }

    console.log(
      'filter',
      items.filter(
        (item) =>
          item[labelKey || 'label']
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) === true
      )
    );

    return items.filter(
      (item) =>
        item[labelKey || 'label']
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) === true
    );
  }
}
