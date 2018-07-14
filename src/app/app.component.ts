import {Component} from '@angular/core';
import * as globs from './globals';

@Component({
  selector: 'app-rw-posts',
  templateUrl: './app.rwPosts.html',
  styleUrls: ['./app.rwPosts.scss']
})

export class AppComponent {

  start = false;

  started(): void {
    globs.started();
    this.start = globs.start;
  }

}
