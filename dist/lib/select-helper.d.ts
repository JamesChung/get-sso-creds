import { ICredentials, ISsoConfig } from "./interfaces";
export declare function getSSOConfigs(): Promise<ISsoConfig[]>;
export declare function getAccounts(ssoConfigs: ISsoConfig[], profile?: string): Promise<Map<any, any>>;
export declare function getToken(ssoUrl: string, ssoConfigs: ISsoConfig[]): string;
export declare function getRoles(accountId: string, accessToken: string, profile?: string): Promise<any>;
export declare function getRoleCredentials(roleName: string, accountId: string, accessToken: string, profile?: string): Promise<ICredentials>;
