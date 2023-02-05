import { Command } from "@oclif/core";
export default class Get extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
        credentials: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        clipboard: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        preserve: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        json: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: never[];
    run(): Promise<void>;
}
