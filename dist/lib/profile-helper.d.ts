import { IProfile } from "./interfaces";
export declare function isProfile(profile: any): boolean;
export declare function getProfileNames(): string[];
export declare function getProfiles(): Map<string, IProfile>;
export declare function getCredProfiles(): string[];
export declare function getProfileInfo(profile?: string): IProfile;
