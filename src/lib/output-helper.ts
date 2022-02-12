import { Command } from '@oclif/core';
import { getProfileCredentials } from '../lib/creds-helper';
import { ICredentials, IProfile, IFlags } from './interfaces';
import * as chalk from 'chalk';

function exportHeaderOutput(command: Command, profileInfo: IProfile, credentials: ICredentials): void {
  command.log(`${chalk.yellowBright('Profile:')} ${chalk.cyan(profileInfo.profileName)}`);
  command.log(`${chalk.yellowBright('Credentials expire at:')} ${chalk.cyan((new Date(credentials.expiration)).toLocaleTimeString())}\n`);
}

function exportOutput(command: Command, credentials: ICredentials): void {
  command.log(`${chalk.yellow('export')} ${chalk.blue('AWS_ACCESS_KEY_ID')}=${chalk.green(credentials.accessKeyId)}`);
  command.log(`${chalk.yellow('export')} ${chalk.blue('AWS_SECRET_ACCESS_KEY')}=${chalk.green(credentials.secretAccessKey)}`);
  command.log(`${chalk.yellow('export')} ${chalk.blue('AWS_SESSION_TOKEN')}=${chalk.green(credentials.sessionToken)}`);
}

export async function output(command: Command, flags: IFlags): Promise<void> {
  try {
    const { profileInfo, credentials } = await getProfileCredentials(flags.profile);

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
  } catch (error: any) {
    command.error(error.message);
  }
}

export async function roleOutput(command: Command, roleName: string, credentials: ICredentials, flags: IFlags): Promise<void> {
  try {
    if (flags?.json) {
      command.log(JSON.stringify(credentials));
      return;
    }

    if (flags?.quiet) {
      exportOutput(command, credentials);
      return;
    }

    command.log(`${chalk.yellowBright('Role:')} ${chalk.cyan(roleName)}`);
    command.log(`${chalk.yellowBright('Credentials expire at:')} ${chalk.cyan((new Date(credentials.expiration)).toLocaleTimeString())}\n`);
    exportOutput(command, credentials);
  } catch (error: any) {
    command.error(error.message);
  }
}
