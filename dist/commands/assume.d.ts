import { Command } from "@oclif/core";
export default class Assume extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        json: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        credentials: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        clipboard: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        "set-as": import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        role: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        "session-name": import("@oclif/core/lib/interfaces").OptionFlag<string>;
        profile: import("@oclif/core/lib/interfaces").OptionFlag<string>;
    };
    static args: never[];
    run(): Promise<void>;
}
