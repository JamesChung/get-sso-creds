import { readFileSync } from 'fs';
import { homedir } from 'os';
import { IProfile } from './interfaces';
import * as chalk from 'chalk';
const ini = require('ini');

export function isProfile(profile: any): boolean {
  const configFile = readFileSync(`${homedir()}/.aws/config`, 'utf-8');
  const iniConfig = ini.parse(configFile);
  const profiles = [];
  for (let prof in iniConfig) {
    profiles.push(prof.split(' ').pop()?.trim());
  }
  if (profiles.includes(profile)) {
    return true;
  }
  return false;
}

export function getProfileNames(): string[] {
  const configFile = readFileSync(`${homedir()}/.aws/config`, 'utf-8');
  const iniConfig = ini.parse(configFile);
  const profiles: string[] = [];
  for (let profileConfig in iniConfig) {
    let confSplit = profileConfig.split(' ');
    let profileName = confSplit[confSplit.length - 1].trim();
    profiles.push(profileName);
  }
  return profiles;
}

export function getProfiles(): Map<string, IProfile> {
  const configFile = readFileSync(`${homedir()}/.aws/config`, 'utf-8');
  const iniConfig = ini.parse(configFile);
  const profiles: Map<string, IProfile> = new Map();
  for (let profileConfig in iniConfig) {
    let confSplit = profileConfig.split(' ');
    let profileName = confSplit[confSplit.length - 1].trim();
    const profileInfo: IProfile = {
      profileName: profileName,
      ssoStartUrl: iniConfig[profileConfig].sso_start_url,
      ssoAccountId: iniConfig[profileConfig].sso_account_id,
      ssoRoleName: iniConfig[profileConfig].sso_role_name,
      region: iniConfig[profileConfig].region,
      identity: {
        account: '',
        userId: '',
        arn: '',
      }
    };
    profiles.set(profileInfo.profileName, profileInfo);
  }
  return profiles;
}

export function getCredProfiles(): string[] {
  const credFile = readFileSync(`${homedir()}/.aws/credentials`, 'utf-8');
  const iniConfig = ini.parse(credFile);
  const profiles: string[] = [];
  for (let profileName in iniConfig) {
    profiles.push(profileName);
  }
  if (profiles.length > 0) {
    return profiles;
  }
  throw `no profiles exist in ~/.aws/credentials`;
}

export function getProfileInfo(profile: string = 'default'): IProfile {
  const profiles = getProfiles();
  if (profiles.has(profile)) {
    return profiles.get(profile)!;
  }
  throw `${chalk.redBright(profile)} is not a valid profile.`;
}
