import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AddressRemoteService } from "../../providers/remote-services/address-remote-service";
import { arrayContains } from '../../utilities/array-contains';
import { AuthenticationService } from '../../providers/authentication/authentication-service';


@Component({
  templateUrl: 'createGroupModal.html'
})
export class CreateGroupModal {

  private users;
  private allUsers;
  private ownUser;
  private groupname: string;
  private members;

  constructor(public view: ViewController, public addressService: AddressRemoteService, public authService: AuthenticationService) {
    this.users = [];
    this.members = [];
    this.addressService.initTokenAndWait().then(_token => {
      this.addressService.getAllUsers().subscribe(users => {
        for (var user of users) {
          if (user.firstname) {
            this.users.push(user);
          }
        }
      });
    });
    this.authService.initService().then(credentials => {
      this.ownUser = credentials;
      this.members.push({ GGUID: this.ownUser.GGUID, role: "ADD_GRPADMIN" });
    });
  }

  isUserChecked(user) {
    let userRole = {
      GGUID: user.GGUID,
      role: "ADD_GRPMEMBER"
    }
    let checked = arrayContains(this.members, userRole);
    return checked;
  }

  searchUsers(ev: any) {
    if (!this.allUsers) {
      this.allUsers = this.users;
    }
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.users = this.allUsers.filter((item) => {
        return (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.users = this.allUsers;
      this.allUsers = null;
    }
  }

  addOrRemoveUser(user) {
    let userRole = {
      GGUID: user.GGUID,
      role: "ADD_GRPMEMBER"
    }
    if (arrayContains(this.members, userRole)) {
      //remove
      let newMembers = [];
      for (var member of this.members) {
        if (member.GGUID != userRole.GGUID) {
          newMembers.push(member);
        }
      }
      this.members = newMembers;
    }
    else {
      //add
      this.members.push(userRole);
    }
  }

  submit() {
    if (this.groupname) {
      this.addressService.postGroup(this.groupname, this.members).subscribe(_result => {
      });
    }
    this.dismiss();
  }

  dismiss() {
    this.view.dismiss();
  }

}
