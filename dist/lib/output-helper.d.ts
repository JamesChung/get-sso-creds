import { Command } from "@oclif/core";
import { ICredentials, IFlags } from "./interfaces";
export declare function clipboardOutput(credentials: ICredentials): void;
export declare function output(command: Command, flags: IFlags): Promise<void>;
export declare function roleOutput(command: Command, roleName: string, credentials: ICredentials, flags: IFlags): Promise<void>;
