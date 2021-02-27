export declare let Endpoints: {
    "account/register": {};
    "account/verify": {};
    "account/account/verifyAge": {};
    "account/acceptTOS": {};
    "account/changeEmail": {};
    "account/login": {};
    "account/setName": {};
    "account/purchaseSkin": {};
    "account/purchasePackage": {};
    "account/getOwnedPetSkins": {};
    "account/list": {};
    "account/servers": {};
    "account/sendVerifyEmail": {};
    "account/forgotPassword": {};
    "account/changePassword": {};
    char: string[];
    guild: string[];
    friends: string[];
    credits: string[];
    package: string[];
};
export interface AppspotRequest {
    endpoint: string;
    params?: {
        [key: string]: any;
    };
}
