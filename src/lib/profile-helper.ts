import { readFileSync } from 'fs';
import { homedir } from 'os';
import { IProfile } from './interfaces';
import { parse } from 'ini';
import * as chalk from 'chalk';

export function isProfile(profile: any): boolean {
  const configFile = readFileSync(`${homedir()}/.aws/config`, 'utf-8');
  const iniConfig = parse(configFile);
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
  try {
    const configFile = readFileSync(`${homedir()}/.aws/config`, 'utf-8');
    const iniConfig = parse(configFile);
    const profiles: string[] = [];
    for (let profileConfig in iniConfig) {
      let confSplit = profileConfig.split(' ');
      let profileName = confSplit[confSplit.length - 1].trim();
      profiles.push(profileName);
    }
    if (profiles.length > 0) {
      return profiles;
    }
    throw new Error(`no profiles exist in ~/.aws/config`);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`~/.aws/config file does not exist`);
    }
    throw error;
  }
}

export function getProfiles(): Map<string, IProfile> {
  const configFile = readFileSync(`${homedir()}/.aws/config`, 'utf-8');
  const iniConfig = parse(configFile);
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
  try {
    const credFile = readFileSync(`${homedir()}/.aws/credentials`, 'utf-8');
    const iniConfig = parse(credFile);
    const profiles: string[] = [];
    for (let profileName in iniConfig) {
      profiles.push(profileName);
    }
    if (profiles.length > 0) {
      return profiles;
    }
    throw new Error(`no profiles exist in ~/.aws/credentials`);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`~/.aws/credentials file does not exist`);
    }
    throw error;
  }
}

export function getProfileInfo(profile: string = 'default'): IProfile {
  const profiles = getProfiles();
  if (profiles.has(profile)) {
    return profiles.get(profile)!;
  }
  throw new Error(`${chalk.redBright(profile)} is not a valid profile.`);
}
