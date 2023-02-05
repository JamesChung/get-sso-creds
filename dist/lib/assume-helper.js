"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assumeRole = void 0;
const child_process_1 = require("child_process");
async function assumeRole(roleArn, sessionName, profile) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`aws sts assume-role --role-arn ${roleArn} --role-session-name ${sessionName} --profile ${profile}`, (error, stdout, stderr) => {
            if (stderr) {
                reject(new Error(stderr));
            }
            if (stdout) {
                const parsedValue = JSON.parse(stdout);
                const returnValue = {
                    accessKeyId: parsedValue.Credentials.AccessKeyId,
                    secretAccessKey: parsedValue.Credentials.SecretAccessKey,
                    sessionToken: parsedValue.Credentials.SessionToken,
                    expiration: parsedValue.Credentials.Expiration,
                };
                resolve(returnValue);
            }
        });
    });
}
exports.assumeRole = assumeRole;
