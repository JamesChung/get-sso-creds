import { Command } from '@oclif/command';
import { getProfileInfo } from '../lib/profile-helper';
import { initCredentials, getCredentials } from '../lib/creds-helper';
import { ICredentials, IProfile, IFlags } from './interfaces';

function exportHeaderOutput(command: Command, profileInfo: IProfile, credentials: ICredentials) {
  command.log(`Profile: ${profileInfo.profileName}`);
  command.log(`Credentials expire at: ${(new Date(credentials.expiration)).toLocaleTimeString()}\n`);
}

function exportOutput(command: Command, credentials: ICredentials) {
  command.log(`export AWS_ACCESS_KEY_ID=${credentials.accessKeyId}`);
  command.log(`export AWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey}`);
  command.log(`export AWS_SESSION_TOKEN=${credentials.sessionToken}`);
}

export async function output(command: Command, flags: IFlags) {
  try {
    const profileInfo = getProfileInfo(flags.profile);
    profileInfo.identity = await initCredentials(profileInfo.profileName);
    const credentials = await getCredentials(profileInfo);
  
    if (flags?.json) {
      command.log(JSON.stringify(credentials));
      return;
    }

    if (flags?.quiet) {
      exportOutput(command, credentials);
      return;
    }

    exportHeaderOutput(command, profileInfo, credentials);
    exportOutput(command, credentials);
  } catch (error) {
    console.log(error);
  }
}
