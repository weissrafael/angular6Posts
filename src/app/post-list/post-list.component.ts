import { Component, OnInit } from '@angular/core';
import {POSTS} from '../mock-posts';
import * as _ from '/home/rafael/Desktop/rwPosts/node_modules/lodash';

const date = new Date();

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts = [];
  users = [];
  editingThisPost =   { id: 0, message: '', ownerId: 0, ownerName: '', date: '', beingEdited: false};
  creatingThisPost =   { id: 0, message: '', ownerId: 777, ownerName: 'You', date: '', beingEdited: false};

  postBeingEdited(post): void {
    this.editingThisPost = _.clone(post);
    post.beingEdited = true;
  }

  deletePost(post): void {
    for (let i = 0; i < this.posts.length; i++) {
      if (post.id === this.posts[i].id) {
        this.posts.splice(i, 1);
        this.updatePosts(this.posts);
        return;
      }
    }
  }

  updatePosts(posts): void {
    localStorage.setItem('posts', JSON.stringify(posts));
  }

  applyPostChanges(post): void {
    for (let i = 0; i < this.posts.length; i++) {
      if (this.editingThisPost.id === this.posts[i].id) {
        this.posts[i] = this.editingThisPost;
        this.cancelPostEdition(post);
        this.updatePosts(this.posts);
        this.refreshPosts();
        return;
      }
    }
  }

  addNewPost(): void {
    console.log(this.posts);
    this.creatingThisPost.date = date.getDate().toString() + ' / ' + date.getMonth().toString();
    if (this.posts.length > 0) {
      this.creatingThisPost.id = this.posts[0].id + 1;
    }
    this.posts.unshift(this.creatingThisPost);
    this.updatePosts(this.posts);
    this.clearPostChanges();
  }

  clearPostChanges(): void {
    this.editingThisPost =   { id: 0, message: '', ownerId: 0, ownerName: '', date: '', beingEdited: false};
    this.creatingThisPost =   { id: 0, message: '', ownerId: 777, ownerName: 'You', date: '', beingEdited: false};
  }

  cancelPostEdition(post): void {
    this.clearPostChanges();
    post.beingEdited = false;
  }

  populate(): void {
    this.updatePosts(POSTS);
    this.refreshPosts();
  }

  clearPosts(): void {
    localStorage.clear();
    this.refreshPosts();
  }

  refreshPosts(): void {
    this.posts = JSON.parse(localStorage.getItem('posts'));
    if (!this.posts) {
      this.posts = [];
      return;
    }
    this.posts = _.orderBy(this.posts, ['id'], ['desc']);
    console.log(this.posts);
  }

  refreshUsers(): void {
    this.users = JSON.parse(localStorage.getItem('users'));
    if (!this.users) {
      this.users = [];
    }
  }

  constructor() { }

  ngOnInit() {
    this.refreshPosts();
  }

}
