"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const profile_helper_1 = require("../lib/profile-helper");
const output_helper_1 = require("../lib/output-helper");
const creds_helper_1 = require("../lib/creds-helper");
const inquirer = require("inquirer");
class Get extends core_1.Command {
    static description = "Get AWS SSO credentials from existing profiles in ~/.aws/config.";
    static examples = [
        `$ gscreds get
? Select a profile: (Use arrow keys)
❯ default
  dev
  prod
  personal

Profile: my-profile
Credentials expire at: 6:20:24 PM

export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
export AWS_SESSION_TOKEN=<AWS_SESSION_TOKEN>`,
    ];
    static flags = {
        help: core_1.Flags.help(),
        credentials: core_1.Flags.boolean({
            char: "c",
            default: false,
            description: "Writes credentials to ~/.aws/credentials (will use default as the profile name if --preserve flag is not used).",
            exclusive: ["clipboard"],
        }),
        clipboard: core_1.Flags.boolean({
            char: "b",
            default: false,
            description: "Writes credentials to clipboard.",
            exclusive: ["credentials"],
        }),
        preserve: core_1.Flags.boolean({
            char: "P",
            description: "Sets selected profile name as the profile name in ~/.aws/credentials when using --credentials flag.",
            dependsOn: ["credentials"],
        }),
        json: core_1.Flags.boolean({
            default: false,
            description: "Outputs credentials in json format.",
        }),
    };
    static args = [];
    async run() {
        const { flags } = await this.parse(Get);
        try {
            const response = await inquirer.prompt([
                {
                    name: "profile",
                    message: "Select a profile:",
                    type: "list",
                    choices: (0, profile_helper_1.getProfileNames)(),
                },
            ]);
            const input = {
                profile: response.profile,
                json: flags.json,
            };
            const { credentials } = await (0, creds_helper_1.getProfileCredentials)(response.profile);
            if (flags.clipboard) {
                core_1.CliUx.ux.action.start("❯ Saving to clipboard");
                (0, output_helper_1.clipboardOutput)(credentials);
                core_1.CliUx.ux.action.stop();
            }
            else if (flags.credentials) {
                core_1.CliUx.ux.action.start("❯ Writing to credentials file");
                if (flags.preserve) {
                    (0, creds_helper_1.writeCredentialsFile)(credentials, response.profile);
                }
                (0, creds_helper_1.writeCredentialsFile)(credentials);
                core_1.CliUx.ux.action.stop();
            }
            else {
                await (0, output_helper_1.output)(this, input);
            }
        }
        catch (error) {
            this.error(error.message);
        }
    }
}
exports.default = Get;
