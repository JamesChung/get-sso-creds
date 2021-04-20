import { readFileSync } from 'fs';
import { homedir } from 'os';
import { IProfile } from './interfaces';
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

export function getProfileInfo(profile: string = 'default'): IProfile {
  const profiles = getProfiles();
  return profiles.get(profile)!;
}
