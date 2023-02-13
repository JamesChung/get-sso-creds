"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const profile_helper_1 = require("../lib/profile-helper");
const creds_helper_1 = require("../lib/creds-helper");
const inquirer_1 = require("inquirer");
class Clear extends core_1.Command {
    static description = "Clears selected credentials in ~/.aws/credentials.";
    static examples = [
        `$ gscreds clear
? Select a profile: (Use arrow keys)
❯ default
  personal`,
    ];
    static flags = {
        help: core_1.Flags.help(),
    };
    async run() {
        try {
            const response = await inquirer_1.default.prompt([
                {
                    name: "profile",
                    message: "Select a profile:",
                    type: "list",
                    choices: (0, profile_helper_1.getCredProfiles)(),
                },
            ]);
            core_1.ux.action.start("❯ Clearing");
            (0, creds_helper_1.clearCredentials)(response.profile);
            core_1.ux.action.stop();
        }
        catch (error) {
            core_1.ux.action.stop("failed");
            this.error(error.message);
        }
    }
}
exports.default = Clear;
