import { Command } from "@oclif/core";
export default class Console extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        browser: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    static args: never[];
    private credentials;
    private loginURL;
    run(): Promise<void>;
}
