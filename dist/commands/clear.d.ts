import { Command } from "@oclif/core";
export default class Clear extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("@oclif/core/lib/interfaces").BooleanFlag<void>;
    };
    run(): Promise<void>;
}
