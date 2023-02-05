"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleCredentials = exports.getRoles = exports.getToken = exports.getAccounts = exports.getSSOConfigs = void 0;
const fs_1 = require("fs");
const os_1 = require("os");
const child_process_1 = require("child_process");
async function readFilePromise(file) {
    const path = `${(0, os_1.homedir)()}/.aws/sso/cache/${file}`;
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
async function getSSOConfigs() {
    const cacheFiles = (0, fs_1.readdirSync)(`${(0, os_1.homedir)()}/.aws/sso/cache`, "utf-8");
    const ssoConfigs = [];
    const promiseFiles = [];
    for (let cacheFile of cacheFiles) {
        promiseFiles.push(readFilePromise(cacheFile));
    }
    const filesData = await Promise.all(promiseFiles);
    for (let data of filesData) {
        const jsonData = JSON.parse(data);
        if (new Date(jsonData.expiresAt).getTime() > new Date().getTime()) {
            if ("startUrl" in jsonData) {
                ssoConfigs.push(jsonData);
            }
        }
    }
    return ssoConfigs;
}
exports.getSSOConfigs = getSSOConfigs;
async function ssoListAccounts(accessToken, profile = "default") {
    const command = `aws sso list-accounts --access-token ${accessToken} --output json --profile ${profile}`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (stderr) {
                reject(new Error(stderr));
            }
            if (stdout) {
                resolve(stdout);
            }
        });
    });
}
async function getAccounts(ssoConfigs, profile = "default") {
    const accounts = new Map();
    for (let ssoConfig of ssoConfigs) {
        const accountList = JSON.parse(await ssoListAccounts(ssoConfig.accessToken, profile));
        accounts.set(ssoConfig.startUrl, accountList);
    }
    return accounts;
}
exports.getAccounts = getAccounts;
function getToken(ssoUrl, ssoConfigs) {
    let token = "";
    for (let ssoConfig of ssoConfigs) {
        if (ssoConfig.startUrl === ssoUrl) {
            token = ssoConfig.accessToken;
        }
    }
    return token;
}
exports.getToken = getToken;
async function getSsoRoles(accountId, accessToken, profile = "default") {
    const command = `aws sso list-account-roles --account-id ${accountId} --access-token ${accessToken} --output json --profile ${profile}`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (stderr) {
                reject(new Error(stderr));
            }
            if (stdout) {
                resolve(stdout);
            }
        });
    });
}
async function getRoles(accountId, accessToken, profile = "default") {
    return JSON.parse(await getSsoRoles(accountId, accessToken, profile)).roleList.map((value) => value.roleName);
}
exports.getRoles = getRoles;
async function getSsoRoleCredentials(roleName, accountId, accessToken, profile = "default") {
    const command = `aws sso get-role-credentials --role-name ${roleName} --account-id ${accountId} --access-token ${accessToken} --output json --profile ${profile}`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (stderr) {
                reject(new Error(stderr));
            }
            if (stdout) {
                resolve(stdout);
            }
        });
    });
}
async function getRoleCredentials(roleName, accountId, accessToken, profile = "default") {
    const { accessKeyId, secretAccessKey, sessionToken, expiration } = JSON.parse(await getSsoRoleCredentials(roleName, accountId, accessToken, profile)).roleCredentials;
    const creds = {
        accessKeyId,
        secretAccessKey,
        sessionToken,
        expiration,
    };
    return creds;
}
exports.getRoleCredentials = getRoleCredentials;
