"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const profile_helper_1 = require("./profile-helper");
const chalk = tslib_1.__importStar(require("chalk"));
async function logout(profile) {
    if (!(0, profile_helper_1.isProfile)(profile)) {
        throw new Error(`${chalk.redBright(profile)} is not a valid profile`);
    }
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`aws sso logout --profile ${profile}`, (error, stdout, stderr) => {
            if (stderr) {
                reject(new Error(stderr));
            }
            if (stdout) {
                resolve(stdout);
            }
        });
    });
}
exports.logout = logout;
