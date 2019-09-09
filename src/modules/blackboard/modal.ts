import { BlackboardRemoteService } from '../../providers/remote-services/blackboard-remote-service';
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { AddressRemoteService } from "../../providers/remote-services/address-remote-service";


@Component({
    templateUrl: 'modal.html'
})
export class BlackboardUserModal {

    private role: string;
    private users;
    private allUsers;
    private blackboardGGUID;

    constructor(public navParams: NavParams, public view: ViewController, public addressService: AddressRemoteService,
        private blackboardService: BlackboardRemoteService) {
        this.users = [];
        this.blackboardGGUID = navParams.get('blackboardGGUID');
        this.addressService.initTokenAndWait().then(_token => {
            this.addressService.getAllUsers().subscribe(users => {
                for (var user of users) {
                    if (user.firstname) {
                        this.users.push(user);
                    }
                }
                if (!this.allUsers) {
                    //backup allUsers for search function
                    this.allUsers = this.users;
                }
            });
        });
    }

    // addUser(user) {
    //   if (this.role !== null) {
    //     this.view.dismiss({ user: user, role: this.role });
    //   }
    // }

    dismiss() {
        this.view.dismiss();
    }

    submit(user) {
        if (this.role !== null) {
            for (var user of this.allUsers) {
                if (user.role == "ADD_ADMIN" || user.role == "ADD_MODERATOR" || user.role == "ADD_EDITOR" || user.role == "ADD_SUBSCRIBER") {
                    this.blackboardService.linkPermission(this.blackboardGGUID, user.GGUID, user.role).subscribe(_result => {
                    });
                }
            }
            this.dismiss();
        }
    }

    searchUsers(ev: any) {
        let val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.users = this.allUsers.filter((item) => {
                return (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
        else {
            this.users = this.allUsers;
        }
    }

}
