export interface IProfile {
    profileName: string;
    ssoStartUrl: string;
    ssoAccountId: string;
    ssoRoleName: string;
    region: string;
    identity: IUserIdentity;
}
export interface IUserIdentity {
    userId: string;
    account: string;
    arn: string;
}
export interface ICredentials {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    expiration: string;
}
export interface IFlags {
    profile?: string;
    json?: boolean;
    quiet?: boolean;
}
export interface ISsoConfig {
    startUrl: string;
    region: string;
    accessToken: string;
    expiresAt: string;
}
