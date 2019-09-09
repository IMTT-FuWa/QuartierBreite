/**
* Interface that describes the available data about the currently logged in user
**/
export interface IUserCredentials {
    firstname: string;
    lastname: string;
    GGUID: string;
    token: string;
    connectedAddresses: Array<any>;
}
