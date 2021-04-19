import { Command } from '@oclif/command';
import { isProfile, getProfileInfo } from '../lib/profile-helper';
import { initCredentials, getCredentials } from '../lib/creds-helper';

export async function output(command: Command, profile: string) {
  if (!isProfile(profile)) {
    throw `> [ ${profile} ] is not a valid profile.`;
  }
  const profileInfo = getProfileInfo(profile);
  profileInfo.identity = await initCredentials(profileInfo.profileName);
  const credentials = await getCredentials(profileInfo);

  command.log(`Profile: ${profileInfo.profileName}`);
  command.log(`Credentials expire at: ${(new Date(credentials.expiration)).toLocaleTimeString()}\n`);
  command.log(`export AWS_ACCESS_KEY_ID=${credentials.accessKeyId}`);
  command.log(`export AWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey}`);
  command.log(`export AWS_SESSION_TOKEN=${credentials.sessionToken}`);
}
