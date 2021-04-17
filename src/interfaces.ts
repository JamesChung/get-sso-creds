interface IProfile {
  profileName: string;
  ssoStartUrl: string;
  ssoAccountId: string;
  ssoRoleName: string;
  region: string;
  identity: IUserIdentity;
}

interface IUserIdentity {
  userId: string;
  account: string;
  arn: string;
}

interface ICredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: string;
}

export { IProfile, IUserIdentity, ICredentials };
