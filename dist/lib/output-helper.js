"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleOutput = exports.output = exports.clipboardOutput = void 0;
const creds_helper_1 = require("../lib/creds-helper");
const clipboardy_1 = require("clipboardy");
const chalk = require("chalk");
function exportHeaderOutput(command, profileInfo, credentials) {
    command.log(`${chalk.yellowBright("Profile:")} ${chalk.cyan(profileInfo.profileName)}`);
    command.log(`${chalk.yellowBright("Credentials expire at:")} ${chalk.cyan(new Date(credentials.expiration).toLocaleTimeString())}\n`);
}
function exportOutput(command, credentials) {
    command.log(`${chalk.yellow("export")} ${chalk.blue("AWS_ACCESS_KEY_ID")}=${chalk.green(credentials.accessKeyId)}`);
    command.log(`${chalk.yellow("export")} ${chalk.blue("AWS_SECRET_ACCESS_KEY")}=${chalk.green(credentials.secretAccessKey)}`);
    command.log(`${chalk.yellow("export")} ${chalk.blue("AWS_SESSION_TOKEN")}=${chalk.green(credentials.sessionToken)}`);
}
function clipboardOutput(credentials) {
    const accessKeyId = `export AWS_ACCESS_KEY_ID=${credentials.accessKeyId}`;
    const secretAccessKey = `export AWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey}`;
    const sessionToken = `export AWS_SESSION_TOKEN=${credentials.sessionToken}`;
    (0, clipboardy_1.writeSync)(`${accessKeyId}\n${secretAccessKey}\n${sessionToken}`);
}
exports.clipboardOutput = clipboardOutput;
async function output(command, flags) {
    try {
        const { profileInfo, credentials } = await (0, creds_helper_1.getProfileCredentials)(flags.profile);
        if (flags?.json) {
            command.log(JSON.stringify(credentials));
            return;
        }
        if (flags?.quiet) {
            exportOutput(command, credentials);
            return;
        }
        exportHeaderOutput(command, profileInfo, credentials);
        exportOutput(command, credentials);
    }
    catch (error) {
        command.error(error.message);
    }
}
exports.output = output;
async function roleOutput(command, roleName, credentials, flags) {
    try {
        if (flags?.json) {
            command.log(JSON.stringify(credentials));
            return;
        }
        if (flags?.quiet) {
            exportOutput(command, credentials);
            return;
        }
        command.log(`${chalk.yellowBright("Role:")} ${chalk.cyan(roleName)}`);
        command.log(`${chalk.yellowBright("Credentials expire at:")} ${chalk.cyan(new Date(credentials.expiration).toLocaleTimeString())}\n`);
        exportOutput(command, credentials);
    }
    catch (error) {
        command.error(error.message);
    }
}
exports.roleOutput = roleOutput;
