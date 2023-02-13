"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const profile_helper_1 = require("../lib/profile-helper");
const inquirer_1 = require("inquirer");
class Ls extends core_1.Command {
    static description = "Lists profile names in ~/.aws/config or ~/.aws/credentials.";
    static examples = [
        `$ gscreds ls
? Select a file: (Use arrow keys)
❯ config
  credentials`,
    ];
    static flags = {
        help: core_1.Flags.help(),
    };
    async run() {
        try {
            const response = await inquirer_1.default.prompt([
                {
                    name: "file",
                    message: "Select a file:",
                    type: "list",
                    choices: ["config", "credentials"],
                },
            ]);
            if (response.file === "config") {
                for (let profile of (0, profile_helper_1.getProfileNames)()) {
                    this.log(profile);
                }
                return;
            }
            if (response.file === "credentials") {
                for (let profile of (0, profile_helper_1.getCredProfiles)()) {
                    this.log(profile);
                }
                return;
            }
        }
        catch (error) {
            core_1.ux.action.stop("failed");
            this.error(error.message);
        }
    }
}
exports.default = Ls;
