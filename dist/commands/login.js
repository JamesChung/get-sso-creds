"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const login_helper_1 = require("../lib/login-helper");
class LogIn extends core_1.Command {
    static description = "Initiates AWS SSO login.";
    static examples = [
        `$ gscreds login --profile your-profile
Logging in... ⣽`,
    ];
    static flags = {
        help: core_1.Flags.help(),
        profile: core_1.Flags.string({
            char: "p",
            default: "default",
            description: "Profile name to use for login.",
        }),
    };
    static args = [];
    async run() {
        const { flags } = await this.parse(LogIn);
        try {
            core_1.CliUx.ux.action.start("❯ Logging in");
            await (0, login_helper_1.login)(flags.profile);
            core_1.CliUx.ux.action.stop();
        }
        catch (error) {
            core_1.CliUx.ux.action.stop("failed");
            this.error(error.message);
        }
    }
}
exports.default = LogIn;
