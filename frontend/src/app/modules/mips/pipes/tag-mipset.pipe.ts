import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagMipset',
})
export class TagMipsetPipe implements PipeTransform {
  transform(value: string): string {
    let newValue: string = '';
    if (value.endsWith('-mipset')) {
      newValue = value.split('-').slice(0, -1).join(' ');
      return newValue;
    }
    return null;
  }
}
