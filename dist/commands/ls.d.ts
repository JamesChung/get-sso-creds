import { Command } from "@oclif/core";
export default class Ls extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
    };
    static args: never[];
    run(): Promise<void>;
}
