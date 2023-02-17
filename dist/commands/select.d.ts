import { Command } from "@oclif/core";
export default class Select extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        credentials: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        clipboard: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        json: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        "set-as": import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        profile: import("@oclif/core/lib/interfaces").OptionFlag<string>;
    };
    static args: never[];
    run(): Promise<void>;
}
