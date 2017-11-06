import { Component, OnInit } from '@angular/core';

import { UserService } from '../_services/index';
import { User } from '../_models/index';

@Component({
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    users: User[] = [];
    constructor(
        private userService: UserService
    ) {}

    ngOnInit(){
        this.userService.getUsers()
            .subscribe(users => {
                this.users = users;
            })
    }
}