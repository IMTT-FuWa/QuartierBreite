import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { AddressRemoteService } from "../../providers/remote-services/address-remote-service";


@Component({
    templateUrl: 'addGroupUserModal.html'
})
export class AddGroupUserModal {

    private users;
    private allUsers;
    private groupGGUID;

    constructor(public navParams: NavParams, public view: ViewController, public addressService: AddressRemoteService) {
        this.users = [];
        this.groupGGUID = navParams.get('groupGGUID');
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

    dismiss() {
        this.view.dismiss();
    }

    submit() {
        for (var user of this.allUsers) {
            if (user.role == "ADD_GRPADMIN" || user.role == "ADD_GRPMEMBER") {
                this.addressService.addGroupMember(user.GGUID, user.role, this.groupGGUID).subscribe(_result => {
                });
            }
        }
        this.dismiss();
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
