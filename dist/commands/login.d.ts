import { Command } from "@oclif/core";
export default class LogIn extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        profile: import("@oclif/core/lib/interfaces").OptionFlag<string>;
    };
    static args: never[];
    run(): Promise<void>;
}
