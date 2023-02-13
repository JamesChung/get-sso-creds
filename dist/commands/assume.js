"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const output_helper_1 = require("../lib/output-helper");
const assume_helper_1 = require("../lib/assume-helper");
const creds_helper_1 = require("../lib/creds-helper");
class Assume extends core_1.Command {
    async run() {
        const { flags } = await this.parse(Assume);
        try {
            const roleCredentials = await (0, assume_helper_1.assumeRole)(flags.role, flags["session-name"], flags.profile);
            if (flags.clipboard) {
                core_1.ux.action.start("❯ Saving to clipboard");
                (0, output_helper_1.clipboardOutput)(roleCredentials);
                core_1.ux.action.stop();
            }
            else if (flags.credentials) {
                core_1.ux.action.start("❯ Writing to credentials file");
                (0, creds_helper_1.writeCredentialsFile)(roleCredentials, flags["set-as"]);
                core_1.ux.action.stop();
            }
            else {
                await (0, output_helper_1.roleOutput)(this, flags.role, roleCredentials, flags);
            }
        }
        catch (error) {
            core_1.ux.action.stop("failed");
            this.error(error.message);
        }
    }
}
exports.default = Assume;
Assume.description = "Assumes AWS Role.";
Assume.examples = [
    `$ gscreds assume --role arn:aws:iam::996942091142:role/test-role`,
    `$ gscreds assume --role arn:aws:iam::996942091142:role/test-role -c --set-as 'my-profile'`,
];
Assume.flags = {
    help: core_1.Flags.help(),
    json: core_1.Flags.boolean({
        default: false,
        description: "Outputs credentials in json format.",
    }),
    credentials: core_1.Flags.boolean({
        char: "c",
        default: false,
        description: "Writes credentials to ~/.aws/credentials (will use [default] as the profile name if --set-as flag is not used).",
        exclusive: ["clipboard"],
    }),
    clipboard: core_1.Flags.boolean({
        char: "b",
        default: false,
        description: "Writes credentials to clipboard.",
        exclusive: ["credentials"],
    }),
    "set-as": core_1.Flags.string({
        char: "n",
        dependsOn: ["credentials"],
        description: "Desired name of profile when setting credentials via --credentials flag.",
    }),
    role: core_1.Flags.string({
        char: "r",
        required: true,
        description: "ARN of the role to assume.",
    }),
    "session-name": core_1.Flags.string({
        char: "s",
        dependsOn: ["role"],
        default: "gscreds-session",
        description: "Desired name for the role session.",
    }),
    profile: core_1.Flags.string({
        char: "p",
        default: "default",
        description: "Desired SSO config profile to use.",
    }),
};
