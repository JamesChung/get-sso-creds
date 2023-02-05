import { ICredentials, IUserIdentity, IProfile } from "./interfaces";
export declare function initCredentials(profile?: string): Promise<IUserIdentity>;
export declare function getCredentialsFromCacheFiles(): Promise<ICredentials[]>;
export declare function getCredentials(profile: IProfile): Promise<ICredentials>;
export declare function writeCredentialsFile(credentials: ICredentials, profile?: string): void;
export declare function clearCredentials(profile?: string): void;
export declare function getCredentialsFromCredentialsFile(profile?: string): ICredentials;
export declare function getProfileCredentials(profile?: string): Promise<{
    profileInfo: IProfile;
    credentials: ICredentials;
}>;
