import { Component, OnInit } from '@angular/core';
import { USERS } from '../mock-users';
import * as _ from '/home/rafael/Desktop/rwPosts/node_modules/lodash';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users = [];
  editingThisUser =   { id: 0, username: '', phone: '', role: '', name: ''};
  creatingThisUser =   { id: 0, username: '', phone: '', role: '', name: ''};

  deleteUser(user): void {
    for (let i = 0; i < this.users.length; i++) {
      if (user.id === this.users[i].id) {
        this.users.splice(i, 1);
        this.updateUsers(this.users);
        return;
      }
    }
  }

  updateUsers(users): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  setNewUserId(): void {
    this.clearUserChanges();
    this.creatingThisUser.id = this.users.length;
  }

  userBeingEdited(user): void {
    this.editingThisUser = _.clone(user);
    console.log(this.editingThisUser);
  }

  applyUserChanges(user): void {
    for (let i = 0; i < this.users.length; i++) {
      if (user.id === this.users[i].id) {
        this.users[i] = user;
        this.updateUsers(this.users);
        this.refreshUsers();
        return;
      }
    }
    this.users.push(user);
    this.updateUsers(this.users);
  }

  clearUserChanges(): void {
    this.editingThisUser =   { id: 0, username: '', phone: '', role: '', name: ''};
    this.creatingThisUser =   { id: 0, username: '', phone: '', role: '', name: ''};
  }

  populate(): void {
    this.updateUsers(USERS);
    this.refreshUsers();
  }

  clearUsers(): void {
    localStorage.clear();
    this.refreshUsers();
  }

  refreshUsers(): void {
    this.users = JSON.parse(localStorage.getItem('users'));
    if (!this.users) {
      this.users = [];
    }
  }

  constructor() { }

  ngOnInit() {
    this.refreshUsers();
  }

}
