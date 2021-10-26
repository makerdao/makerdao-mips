import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewsService } from 'src/app/services/news/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  news: any[] = [];

  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.newsService.getData().subscribe((data) => {
        this.news = data;
      })
    );
  }

  removeItem(i: number): void {
    this.news = this.news.filter((v, index) => index !== i);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
