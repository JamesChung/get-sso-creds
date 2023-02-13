"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const child_process_1 = require("child_process");
const profile_helper_1 = require("./profile-helper");
const chalk = require("chalk");
async function login(profile) {
    if (!(0, profile_helper_1.isProfile)(profile)) {
        throw new Error(`${chalk.redBright(profile)} is not a valid profile`);
    }
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`aws sso login --profile ${profile}`, (error, stdout, stderr) => {
            if (stderr) {
                reject(new Error(stderr));
            }
            if (stdout) {
                resolve(stdout);
            }
        });
    });
}
exports.login = login;
