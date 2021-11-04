import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LangService } from '../lang/lang.service';

const YAML = require('yaml');

import { environment as env } from '../../../environments/environment';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private httpClient: HttpClient, private langService: LangService) { }

  getNews(): Observable<any> {
    return this.httpClient.get(`${env.newsURL}`, {responseType: 'text'}).pipe(map(data => YAML.parse(data)));
  }

  getVars(url = env.varsURL): Observable<any> {
    return this.httpClient.get(`${url}`, {responseType: 'text'}).pipe(map(data => YAML.parse(data)));
  }

  getData(): Observable<any> {
    let url = env.varsURL;

    if (this.langService.lang !== 'en') {
      url = url.replace(
        'meta',
        `I18N/${this.langService.lang.toUpperCase()}/meta`
      );
    }

    const oldNews: string[] = JSON.parse(localStorage.getItem('OLD-NEWS'));

    return forkJoin([this.getNews(), this.getVars(url)]).pipe(map(data => {
      const news = [];
      const vars = data[1].news;

      for (const item of data[0].data) {
        if (oldNews?.some(d => d === item.id)) {
          continue;
        }

        news.push({
          id: item.id,
          title: vars[item.title.replace('\$', '')],
          description: vars[item.description.replace('\$', '')],
          type: item.type,
          link: item.link
        });

      }

      return news;
    }));
  }

}
