import { Command, flags } from '@oclif/command';
import { isProfile, getProfileInfo } from './profile-helper';
import { initCredentials, getCredentials } from './creds-helper';

class GetSsoCreds extends Command {
  static description = 'Get AWS SSO credentials';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h', description: '' }),
    profile: flags.string({ name: 'profile', char: 'p', default: 'default' }),
  };

  static args = [];

  async run() {
    const { flags } = this.parse(GetSsoCreds);

    try {
      if (!isProfile(flags.profile)) {
        throw `> [ ${flags.profile} ] is not a valid profile.`;
      }
      const profileInfo = getProfileInfo(flags.profile);
      profileInfo.identity = await initCredentials(profileInfo.profileName);
      const credentials = await getCredentials(profileInfo);

      this.log(`Profile: ${profileInfo.profileName}`);
      this.log(`Credentials expire at: ${(new Date(credentials.expiration)).toLocaleTimeString()}\n`);
      this.log(`export AWS_ACCESS_KEY_ID=${credentials.accessKeyId}`);
      this.log(`export AWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey}`);
      this.log(`export AWS_SESSION_TOKEN=${credentials.sessionToken}`);
    }
    catch (error) {
      console.error(error);
    }
  }
}

export = GetSsoCreds
