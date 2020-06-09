import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  private items: any[] = [];
  public search: string;

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(private http: HttpClient) {
   this.getRepos('');
  }

  ngAfterViewInit() {
    const keyupEvent = fromEvent(this.searchInput.nativeElement, 'keyup');

    keyupEvent.subscribe(() => {
      this.items = [];
    });

    keyupEvent
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.getRepos(this.searchInput.nativeElement.value);
    });
  }

  getRepos(search: string) {
    this.http.get(
      'https://api.github.com/search/repositories?q=' + search + '+language:javascript&sort=stars&order=desc'
    )
    .subscribe((result: any) => {
      this.items = result.items;
    });
  }

  truncate(string: string) {
    if (string && string.length > 300) {
      return string.substr(0, 300) + '...';
    }

    return string;
  }
}
