"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileCredentials = exports.getCredentialsFromCredentialsFile = exports.clearCredentials = exports.writeCredentialsFile = exports.getCredentials = exports.getCredentialsFromCacheFiles = exports.initCredentials = void 0;
const tslib_1 = require("tslib");
const os_1 = require("os");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const aws_sdk_1 = require("aws-sdk");
const profile_helper_1 = require("./profile-helper");
const chalk = tslib_1.__importStar(require("chalk"));
const ini_1 = require("ini");
async function initCredentials(profile = "default") {
    if (!(0, profile_helper_1.isProfile)(profile)) {
        throw new Error(`${chalk.redBright(profile)} is not a valid profile`);
    }
    const runStsCommand = `aws sts get-caller-identity --profile ${profile} --output json`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(runStsCommand, (error, stdout, stderr) => {
            if (stderr) {
                reject(new Error(stderr));
            }
            if (stdout) {
                const { UserId, Account, Arn } = JSON.parse(stdout);
                const userIdentity = {
                    userId: UserId,
                    account: Account,
                    arn: Arn,
                };
                resolve(userIdentity);
            }
        });
    });
}
exports.initCredentials = initCredentials;
async function readCredsFile(path) {
    return new Promise((resolve, reject) => {
        (0, fs_1.readFile)(path, "utf-8", (err, data) => {
            if (err) {
                reject(err);
            }
            if (data) {
                resolve(data);
            }
        });
    });
}
async function getCredentialsFromCacheFiles() {
    const credsList = [];
    const credfileNames = (0, fs_1.readdirSync)(`${(0, os_1.homedir)()}/.aws/cli/cache`, "utf-8");
    const credFilePromises = [];
    for (let credFile of credfileNames) {
        credFilePromises.push(readCredsFile(`${(0, os_1.homedir)()}/.aws/cli/cache/${credFile}`));
    }
    const credentialsList = await Promise.all(credFilePromises);
    for (let credData of credentialsList) {
        const creds = JSON.parse(credData).Credentials;
        const credentials = {
            accessKeyId: creds.AccessKeyId,
            secretAccessKey: creds.SecretAccessKey,
            sessionToken: creds.SessionToken,
            expiration: creds.Expiration,
        };
        if (new Date(credentials.expiration).getTime() > new Date().getTime()) {
            credsList.push(credentials);
        }
    }
    return credsList;
}
exports.getCredentialsFromCacheFiles = getCredentialsFromCacheFiles;
async function getCredentials(profile) {
    const credsList = await getCredentialsFromCacheFiles();
    const sts = new aws_sdk_1.STS({ region: profile?.region });
    for (let creds of credsList) {
        sts.config.credentials = {
            accessKeyId: creds.accessKeyId,
            secretAccessKey: creds.secretAccessKey,
            sessionToken: creds.sessionToken,
        };
        const { UserId, Account, Arn } = await sts.getCallerIdentity().promise();
        const { userId, account, arn } = profile.identity;
        if (UserId === userId && Account === account && Arn == arn) {
            return creds;
        }
    }
    throw new Error(`no valid credentials`);
}
exports.getCredentials = getCredentials;
function writeCredentialsFile(credentials, profile = "default") {
    const credentialsFilePath = `${(0, os_1.homedir)()}/.aws/credentials`;
    if (!(0, fs_1.existsSync)(credentialsFilePath)) {
        (0, fs_1.writeFileSync)(credentialsFilePath, "[default]", { encoding: "utf-8" });
    }
    let parsedCredentials = (0, ini_1.parse)((0, fs_1.readFileSync)(credentialsFilePath, "utf-8"));
    if (!parsedCredentials[profile]) {
        (0, fs_1.appendFileSync)(credentialsFilePath, `[${profile}]`, { encoding: "utf-8" });
        parsedCredentials = (0, ini_1.parse)((0, fs_1.readFileSync)(credentialsFilePath, "utf-8"));
    }
    parsedCredentials[profile].aws_access_key_id = credentials.accessKeyId;
    parsedCredentials[profile].aws_secret_access_key =
        credentials.secretAccessKey;
    parsedCredentials[profile].aws_session_token = credentials.sessionToken;
    const encodedCredentials = (0, ini_1.encode)(parsedCredentials);
    (0, fs_1.writeFileSync)(credentialsFilePath, encodedCredentials, { encoding: "utf-8" });
}
exports.writeCredentialsFile = writeCredentialsFile;
function clearCredentials(profile = "default") {
    const credentialsFilePath = `${(0, os_1.homedir)()}/.aws/credentials`;
    if (!(0, fs_1.existsSync)(credentialsFilePath)) {
        throw new Error(`credentials file does not exist`);
    }
    const parsedCredentials = (0, ini_1.parse)((0, fs_1.readFileSync)(credentialsFilePath, "utf-8"));
    if (parsedCredentials[profile]) {
        delete parsedCredentials[profile];
        const encodedCredentials = (0, ini_1.encode)(parsedCredentials);
        (0, fs_1.writeFileSync)(credentialsFilePath, encodedCredentials, {
            encoding: "utf-8",
        });
        return;
    }
    throw new Error(`${chalk.red(profile)} does not exist`);
}
exports.clearCredentials = clearCredentials;
function getCredentialsFromCredentialsFile(profile = "default") {
    const credentialsFilePath = `${(0, os_1.homedir)()}/.aws/credentials`;
    if (!(0, fs_1.existsSync)(credentialsFilePath)) {
        throw new Error(`credentials file does not exist`);
    }
    const parsedCredentials = (0, ini_1.parse)((0, fs_1.readFileSync)(credentialsFilePath, "utf-8"));
    if (parsedCredentials[profile]) {
        return {
            accessKeyId: parsedCredentials[profile]?.aws_access_key_id,
            secretAccessKey: parsedCredentials[profile]?.aws_secret_access_key,
            sessionToken: parsedCredentials[profile]?.aws_session_token,
            expiration: "",
        };
    }
    throw new Error(`${chalk.red(profile)} does not exist`);
}
exports.getCredentialsFromCredentialsFile = getCredentialsFromCredentialsFile;
async function getProfileCredentials(profile = "default") {
    const profileInfo = (0, profile_helper_1.getProfileInfo)(profile);
    profileInfo.identity = await initCredentials(profileInfo.profileName);
    const credentials = await getCredentials(profileInfo);
    return { profileInfo, credentials };
}
exports.getProfileCredentials = getProfileCredentials;
