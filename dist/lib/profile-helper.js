"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileInfo = exports.getCredProfiles = exports.getProfiles = exports.getProfileNames = exports.isProfile = void 0;
const fs_1 = require("fs");
const os_1 = require("os");
const ini_1 = require("ini");
const chalk = require("chalk");
function isProfile(profile) {
    const configFile = (0, fs_1.readFileSync)(`${(0, os_1.homedir)()}/.aws/config`, "utf-8");
    const iniConfig = (0, ini_1.parse)(configFile);
    const profiles = [];
    for (let prof in iniConfig) {
        profiles.push(prof.split(" ").pop()?.trim());
    }
    if (profiles.includes(profile)) {
        return true;
    }
    return false;
}
exports.isProfile = isProfile;
function getProfileNames() {
    try {
        const configFile = (0, fs_1.readFileSync)(`${(0, os_1.homedir)()}/.aws/config`, "utf-8");
        const iniConfig = (0, ini_1.parse)(configFile);
        const profiles = [];
        for (let profileConfig in iniConfig) {
            let confSplit = profileConfig.split(" ");
            let profileName = confSplit[confSplit.length - 1].trim();
            profiles.push(profileName);
        }
        if (profiles.length > 0) {
            return profiles;
        }
        throw new Error(`no profiles exist in ~/.aws/config`);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            throw new Error(`~/.aws/config file does not exist`);
        }
        throw error;
    }
}
exports.getProfileNames = getProfileNames;
function getProfiles() {
    const configFile = (0, fs_1.readFileSync)(`${(0, os_1.homedir)()}/.aws/config`, "utf-8");
    const iniConfig = (0, ini_1.parse)(configFile);
    const profiles = new Map();
    for (let profileConfig in iniConfig) {
        let confSplit = profileConfig.split(" ");
        let profileName = confSplit[confSplit.length - 1].trim();
        const profileInfo = {
            profileName: profileName,
            ssoStartUrl: iniConfig[profileConfig].sso_start_url,
            ssoAccountId: iniConfig[profileConfig].sso_account_id,
            ssoRoleName: iniConfig[profileConfig].sso_role_name,
            region: iniConfig[profileConfig].region,
            identity: {
                account: "",
                userId: "",
                arn: "",
            },
        };
        profiles.set(profileInfo.profileName, profileInfo);
    }
    return profiles;
}
exports.getProfiles = getProfiles;
function getCredProfiles() {
    try {
        const credFile = (0, fs_1.readFileSync)(`${(0, os_1.homedir)()}/.aws/credentials`, "utf-8");
        const iniConfig = (0, ini_1.parse)(credFile);
        const profiles = [];
        for (let profileName in iniConfig) {
            profiles.push(profileName);
        }
        if (profiles.length > 0) {
            return profiles;
        }
        throw new Error(`no profiles exist in ~/.aws/credentials`);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            throw new Error(`~/.aws/credentials file does not exist`);
        }
        throw error;
    }
}
exports.getCredProfiles = getCredProfiles;
function getProfileInfo(profile = "default") {
    const profiles = getProfiles();
    if (profiles.has(profile)) {
        return profiles.get(profile);
    }
    throw new Error(`${chalk.redBright(profile)} is not a valid profile.`);
}
exports.getProfileInfo = getProfileInfo;
