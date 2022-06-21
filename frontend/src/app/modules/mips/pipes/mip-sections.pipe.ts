import { Pipe, PipeTransform } from '@angular/core';

const CLASS_NAME_BY_DEPTH = {
  1: 'titleLevelOne',
  2: 'title',
  3: 'sub-title'
};


@Pipe({
  name: 'mipSections'
})
export class MipSectionsPipe implements PipeTransform {

  transform(sections: { depth: number, heading: string }[], allowedDepths = [1, 2, 3]) {
    if (sections) {
      return sections.filter(s => allowedDepths.includes(s.depth)).map(section => ({
        ...section,
        fragment: this._fragmentBySection(section.heading),
        className: CLASS_NAME_BY_DEPTH[section.depth]
      }));
    }
    return [];
  }

  private _fragmentBySection(text: string): string {
    const pattern = /\bmip[0-9]+c[0-9]+:/i;
    if (pattern.test(text)) {
      return text.split(':')[0];
    }

    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return escapedText;
  }
}
