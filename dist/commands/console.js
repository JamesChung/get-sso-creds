"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const creds_helper_1 = require("../lib/creds-helper");
const console_helper_1 = require("../lib/console-helper");
const profile_helper_1 = require("../lib/profile-helper");
const inquirer_1 = require("inquirer");
const open = require("open");
class Console extends core_1.Command {
    static description = "Opens AWS Console for a selected profile.";
    static examples = [
        `$ gscreds console
? Select a profile: (Use arrow keys)
❯ default
  personal`,
    ];
    static flags = {
        help: core_1.Flags.help(),
        browser: core_1.Flags.string({
            char: "b",
            options: ["chrome", "firefox", "edge"],
            description: `Opens designated browser over the system default.\n
      Suggested values: ["chrome", "firefox", "edge"]`,
        }),
    };
    credentials;
    loginURL;
    async run() {
        const { flags } = await this.parse(Console);
        let browser = "";
        switch (flags.browser) {
            case "chrome":
                browser = open.apps.chrome;
                break;
            case "firefox":
                browser = open.apps.firefox;
                break;
            case "edge":
                browser = open.apps.edge;
                break;
        }
        try {
            const { profileType } = await inquirer_1.default.prompt([
                {
                    name: "profileType",
                    message: "Select a file:",
                    type: "list",
                    choices: ["config", "credentials"],
                },
            ]);
            const { profile } = await inquirer_1.default.prompt([
                {
                    name: "profile",
                    message: "Select a profile:",
                    type: "list",
                    choices: profileType === "config" ? (0, profile_helper_1.getProfileNames)() : (0, profile_helper_1.getCredProfiles)(),
                },
            ]);
            core_1.ux.action.start("❯ Opening Console");
            if (profileType === "config") {
                this.credentials = (await (0, creds_helper_1.getProfileCredentials)(profile)).credentials;
            }
            if (profileType === "credentials") {
                this.credentials = (0, creds_helper_1.getCredentialsFromCredentialsFile)(profile);
            }
            this.loginURL = await (0, console_helper_1.generateLoginURL)(this.credentials);
            await open(this.loginURL, {
                app: {
                    name: browser,
                },
            }).then((result) => {
                if (typeof result.exitCode === "number" && result.exitCode > 0) {
                    throw new Error("Could not open browser.");
                }
            });
            core_1.ux.action.stop();
        }
        catch (error) {
            core_1.ux.action.stop("failed");
            this.error(error.message);
        }
    }
}
exports.default = Console;
