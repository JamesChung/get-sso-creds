import { ICredentials } from "../lib/interfaces";
export declare function assumeRole(roleArn: string, sessionName: string, profile: string): Promise<ICredentials>;
