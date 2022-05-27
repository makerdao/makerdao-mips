import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LangService } from '../lang/lang.service';
import * as moment from 'moment';
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

        const oldNews: any[] = JSON.parse(localStorage.getItem('OLD-NEWS'));

        return forkJoin([this.getNews(), this.getVars(url)]).pipe(map(data => {
            const news = [];
            const vars = data[1].news;



            for (const item of data[0]?.data || []) {

                const userFriendlyTimelock = item?.timelock?.toString() || '';
                const timelock = userFriendlyTimelock
                    ? userFriendlyTimelock?.match(/\s/g)
                        ? moment.duration(...userFriendlyTimelock?.split(' ')).asMilliseconds()
                        : moment.duration(userFriendlyTimelock).asMilliseconds()
                    : null;

                if (oldNews?.some(oldNew => {
                    if (oldNew?.id === item.id){

                        if (!item?.timelock){
                            // If timelock not defined
                            return true;
                        }

                        if (Date.now() - oldNew?.timeClosed > timelock){

                            const oldNewsLocalStore: any[] = JSON.parse(localStorage.getItem('OLD-NEWS')) || [];

                            const cleanedNews = oldNewsLocalStore.filter(it => it.id !== item.id);

                            localStorage.setItem('OLD-NEWS', JSON.stringify(cleanedNews));

                            return  false;
                        }
                        else{
                            return true;
                        }
                    }
                    return false;
                })) {
                    continue;
                }

                news.push({
                    id: item?.id,
                    timelock,
                    title: vars[item?.title?.replace('\$', '')],
                    description: vars[item?.description?.replace('\$', '')],
                    type: item?.type,
                    link: vars[item?.link?.replace('\$', '')],
                    mip:item?.mip,
                    linkforum: vars[item?.linkforum?.replace('\$', '')],
                    linkmd: vars[item?.linkmd?.replace('\$', '')]
                });

            }

            return news;
        }));
    }

}
