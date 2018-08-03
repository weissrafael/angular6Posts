import { Component, OnInit } from '@angular/core';
import { USERS } from '../mock-users';
import * as _ from '../../../node_modules/lodash';
import swal from 'sweetalert2';

declare var jQuery: any;


@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    users = [];
    phoneErrorMsg = '';
    usernameErrorMsg = '';
    tempUser = { id: 0, username: '', phone: '', role: '', name: '' };
    validations = { usernameValid: false, phoneValid: false, nameValid: false, roleValid: false, usernameInvalid: false, phoneInvalid: false, nameInvalid: false, roleInvalid: false };

    deleteUser(user): void {
        swal({
            title: 'Are you sure?',
            text: 'All user data will be lost!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                    for (let i = 0; i < this.users.length; i++) {
                        if (user.id === this.users[i].id) {
                            this.users.splice(i, 1);
                            this.updateUsers(this.users);
                        }
                    }
                swal('Poof!', 'the user has been deleted!', 'success');
                }
            });
    }

    updateUsers(users): void {
        localStorage.setItem('users', JSON.stringify(users));
    }

    setNewUserId(): void {
        this.tempUser.id = this.users.length;
    }

    userBeingEdited(user): void {
        this.tempUser = _.clone(user);
    }

    validateUserForm(): boolean {
        this.validateUsername();
        this.validatePhone();
        this.validateName();
        this.validateRole();
        return this.validations.roleValid && this.validations.nameValid && this.validations.usernameValid && this.validations.phoneValid;
    }

    validateUsername(): void {
        if (this.tempUser.username === '') {
            this.validations.usernameValid = false;
            this.validations.usernameInvalid = true;
            this.usernameErrorMsg = 'All fields are required';
            return;
        }
        const confirmation = this.tempUser.username.match(/[\w-_]+/g);
        if (confirmation === null) {
            this.validations.usernameValid = false;
            this.validations.usernameInvalid = true;
            this.usernameErrorMsg = 'Only Alphanumeric, hyphen and underscore please :) ';
            return;
        }
        this.validations.usernameInvalid = false;
        this.validations.usernameValid = true;
    }

    validateName(): void {
        if (this.tempUser.name === '') {
            this.validations.nameValid = false;
            this.validations.nameInvalid = true;
            return;
        }
        this.validations.nameInvalid = false;
        this.validations.nameValid = true;
    }

    validateRole(): void {
        if (this.tempUser.role === '') {
            this.validations.roleValid = false;
            this.validations.roleInvalid = true;
            return;
        }
        this.validations.roleInvalid = false;
        this.validations.roleValid = true;
    }

    validatePhone(): void {
        const confirmation = this.tempUser.phone.match(/\(?[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/g);
        if (confirmation === null) {
            this.validations.phoneValid = false;
            this.validations.phoneInvalid = true;
            this.phoneErrorMsg = 'Not a valid phone number';
            return;
        }
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].phone === this.tempUser.phone.trim() && this.users[i].id !== this.tempUser.id) {
                this.validations.phoneValid = false;
                this.validations.phoneInvalid = true;
                this.phoneErrorMsg = 'This phone is already in use by another user ):';
                return;
            }
        }
        this.validations.phoneInvalid = false;
        this.validations.phoneValid = true;
    }

    applyUserChanges(user): void {
        if (this.validateUserForm()) {
            for (let i = 0; i < this.users.length; i++) {
                if (user.id === this.users[i].id) {
                    this.users[i] = user;
                    this.updateUsers(this.users);
                    this.refreshUsers();
                    this.clearUserChanges();
                    jQuery('#adminModal').modal('hide');
                    return;
                }
            }
            this.users.push(user);
            this.updateUsers(this.users);
            this.clearUserChanges();
            jQuery('#adminModal').modal('hide');
        } else {
            swal('Ops!', 'Please check the invalid fields.', 'error');
        }
    }

    clearUserChanges(): void {
        this.tempUser =   { id: 0, username: '', phone: '', role: '', name: ''};
        this.validations = { usernameValid: false, phoneValid: false, nameValid: false, roleValid: false, usernameInvalid: false, phoneInvalid: false, nameInvalid: false, roleInvalid: false };
    }

    populate(): void {
        this.updateUsers(USERS);
        this.refreshUsers();
    }

    clearUsers(): void {
        localStorage.removeItem('users');
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
