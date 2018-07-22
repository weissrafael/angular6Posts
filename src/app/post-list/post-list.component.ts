import { Component, OnInit } from '@angular/core';
import {POSTS} from '../mock-posts';
import * as _ from '/home/rafael/Desktop/rwPosts/node_modules/lodash';
import {USERS} from '../mock-users';

const date = new Date();

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
    posts = [];
    users = [];
    clock = null;
    usersNames = [];
    usersPhones = [];
    editingThisPost =   { id: 0, message: '', date: '', beingEdited: false, userPopUp: false, slidePanel: false, user: {}};
    creatingThisPost =   { id: 0, message: '', date: '', beingEdited: false, userPopUp: false, slidePanel: false, user: {}};
    you =  { id: 2, username: 'siperMan', phone: '992312312', role: 'Tester', name: 'You'};


    postBeingEdited(post): void {
        this.editingThisPost = _.clone(post);
        post.beingEdited = true;
    }

    deletePost(post): void {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this post!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    for (let i = 0; i < this.posts.length; i++) {
                        if (post.id === this.posts[i].id) {
                            this.posts.splice(i, 1);
                            this.updatePosts(this.posts);
                        }
                    }
                    swal("Poof! the post has been deleted!", {
                        icon: "success",
                    });
                }
            });
    }

    toggleUserPopUp(post): void {
        if (post.userPopUp) {
            this.closeUserPopUp(post);
        } else {
            this.openUserPopUp(post);
        }
    }

    openUserPopUp(post): void {
        post.userPopUp = true;
        setTimeout(() => { post.slidePanel = true; }, 500);
    }

    closeUserPopUp(post): void {
        setTimeout(() => { post.userPopUp = false; }, 500);
        post.slidePanel = false;
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
        this.creatingThisPost.user = this.you;
        this.posts.unshift(this.creatingThisPost);
        this.updatePosts(this.posts);
        this.clearPostChanges();
    }

    clearPostChanges(): void {
        this.editingThisPost =   { id: 0, message: '', date: '', beingEdited: false, userPopUp: false,  user: {}};
        this.creatingThisPost =   { id: 0, message: '', date: '', beingEdited: false, userPopUp: false,  user: {}};
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
        localStorage.removeItem('posts');
        this.refreshPosts();
    }

    refreshPosts(): void {
        this.posts = JSON.parse(localStorage.getItem('posts'));
        if (!this.posts) {
            this.posts = [];
            return;
        }
        this.posts = _.orderBy(this.posts, ['id'], ['desc']);
    }

    refreshUsersNamesAndPhones(): void {
        this.users = JSON.parse(localStorage.getItem('users'));
        if (!this.users) {
            this.users = [];
            return;
        }
        this.usersNames = [];
        this.usersPhones = [];
        for (let i = 0; i < this.users.length; i++) {
            this.usersNames.push(this.users[i].name);
            this.usersPhones.push(this.users[i].phone);
        }
    }

    checkEnterPressed(event): void {
        if (event.keyCode === 50) {
            this.autocomplete(document.getElementById('postFormControlTextarea1'), this.usersNames, '@');
        }
        if (event.keyCode === 51) {
            this.autocomplete(document.getElementById('postFormControlTextarea1'), this.usersPhones, '#');
        }
    }

    checkEnterPressedOnEdit(event): void {
        if (event.keyCode === 50) {
            this.autocompletePost(document.getElementById('postFormControlTextarea'), this.usersNames, '@');
        }
        if (event.keyCode === 51) {
            this.autocompletePost(document.getElementById('postFormControlTextarea'), this.usersPhones, '#');
        }
    }

    autocomplete(inp, arr, pressedKey): void {
        let currentFocus;
        const creatingPost = this.creatingThisPost;
        inp.addEventListener('input', function(e) {
            const valueArray = this.value.split(pressedKey);
            let a, b, val = valueArray.pop();
            const previousText = valueArray.join(pressedKey);
            closeAllLists(null);
            if (!val) { return; }
            currentFocus = -1;
            a = document.createElement('DIV');
            a.setAttribute('id', this.id + 'autocomplete-list');
            a.setAttribute('class', 'autocomplete-items');
            this.parentNode.appendChild(a);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                    b = document.createElement('DIV');
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    b.addEventListener('click', function(e) {
                        inp.value = previousText + this.getElementsByTagName('input')[0].value;
                        creatingPost.message = inp.value;
                        closeAllLists(null);
                    });
                    a.appendChild(b);
                }
            }
        });
        inp.addEventListener('keydown', function(e) {
            const y = document.getElementById(this.id + 'autocomplete-list');
            let x = null;
            if (y) {
                x = y.getElementsByTagName('div');
            }
            if (e.keyCode === 40) {
                /*arrow down*/
                currentFocus++;
                addActive(x);
            } else if (e.keyCode === 38) { // up
                currentFocus--;
                addActive(x);
            } else if (e.keyCode === 13) {
                /*ENTER key*/
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) {
                        x[currentFocus].click();
                    }
                }
            }
        });
        function addActive(x) {
            if (!x) {
                return false;
            }
            removeActive(x);
            if (currentFocus >= x.length) {
                currentFocus = 0;
            }
            if (currentFocus < 0) {
                currentFocus = (x.length - 1);
            }
            x[currentFocus].classList.add('autocomplete-active');
        }
        function removeActive(x) {
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove('autocomplete-active');
            }
        }
        function closeAllLists(elmnt) {
            const x = document.getElementsByClassName('autocomplete-items');
            for (let i = 0; i < x.length; i++) {
                if (elmnt !== x[i] && elmnt !== inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        document.addEventListener('click', function (e) {
            closeAllLists(e.target);
        });
    }

    autocompletePost(inp, arr, pressedKey): void {
        let currentFocus;
        const editingPost = this.editingThisPost;
        inp.addEventListener('input', function(e) {
            const valueArray = this.value.split(pressedKey);
            let a, b, val = valueArray.pop();
            const previousText = valueArray.join(pressedKey);
            closeAllLists(null);
            if (!val) { return; }
            currentFocus = -1;
            a = document.createElement('DIV');
            a.setAttribute('id', this.id + 'autocomplete-list');
            a.setAttribute('class', 'autocomplete-post-items');
            this.parentNode.appendChild(a);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                    b = document.createElement('DIV');
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    b.addEventListener('click', function(e) {
                        inp.value = previousText + this.getElementsByTagName('input')[0].value;
                        editingPost.message = inp.value;
                        closeAllLists(null);
                    });
                    a.appendChild(b);
                }
            }
        });
        inp.addEventListener('keydown', function(e) {
            const y = document.getElementById(this.id + 'autocomplete-list');
            let x = null;
            if (y) {
                x = y.getElementsByTagName('div');
            }
            if (e.keyCode === 40) {
                /*arrow down*/
                currentFocus++;
                addActive(x);
            } else if (e.keyCode === 38) { // up
                currentFocus--;
                addActive(x);
            } else if (e.keyCode === 13) {
                /*ENTER key*/
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) {
                        x[currentFocus].click();
                    }
                }
            }
        });
        function addActive(x) {
            if (!x) {
                return false;
            }
            removeActive(x);
            if (currentFocus >= x.length) {
                currentFocus = 0;
            }
            if (currentFocus < 0) {
                currentFocus = (x.length - 1);
            }
            x[currentFocus].classList.add('autocomplete-post-active');
        }
        function removeActive(x) {
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove('autocomplete-post-active');
            }
        }
        function closeAllLists(elmnt) {
            const x = document.getElementsByClassName('autocomplete-post-items');
            for (let i = 0; i < x.length; i++) {
                if (elmnt !== x[i] && elmnt !== inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        document.addEventListener('click', function (e) {
            closeAllLists(e.target);
        });
    }

    constructor() { }

    ngOnInit() {
        this.refreshPosts();
        this.refreshUsersNamesAndPhones();
    }

}

