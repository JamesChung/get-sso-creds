"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const logout_helper_1 = require("../lib/logout-helper");
class LogOut extends core_1.Command {
    static description = "Initiates AWS SSO logout.";
    static examples = [
        `$ gscreds logout --profile your-profile
Logging out... ⣽`,
    ];
    static flags = {
        help: core_1.Flags.help(),
        profile: core_1.Flags.string({
            char: "p",
            default: "default",
            description: "Profile name to use for logout.",
        }),
    };
    static args = [];
    async run() {
        const { flags } = await this.parse(LogOut);
        try {
            core_1.CliUx.ux.action.start("❯ Logging out");
            await (0, logout_helper_1.logout)(flags.profile);
            core_1.CliUx.ux.action.stop();
        }
        catch (error) {
            core_1.CliUx.ux.action.stop("failed");
            this.error(error.message);
        }
    }
}
exports.default = LogOut;
