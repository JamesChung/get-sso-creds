get-sso-creds
=============

CLI tool to get AWS SSO temporary credentials.

[![Version](https://img.shields.io/npm/v/get-sso-creds.svg)](https://npmjs.org/package/get-sso-creds)
[![Downloads/week](https://img.shields.io/npm/dw/get-sso-creds.svg)](https://npmjs.org/package/get-sso-creds)
[![License](https://img.shields.io/npm/l/get-sso-creds)](https://github.com/JamesChung/get-sso-creds/blob/main/LICENSE)

<!-- toc -->
* [Prerequisites](#Prerequisites)
* [Usage](#usage)
<!-- tocstop -->

# Prerequisites
<!-- prerequisites -->
AWS CLI v2

https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
<!-- prerequisitesstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g get-sso-creds
```

```sh-session
CLI tool to get AWS SSO temporary credentials.

USAGE
  $ gsc [COMMAND]

COMMANDS
  clear           clears default credentials in ~/.aws/credentials
  get             get AWS SSO credentials by profile
  help            display help for gsc
  login           initiates AWS SSO login
  logout          initiates AWS SSO logout
  select          get AWS SSO credentials by interactive AWS SSO selection
  select-profile  get AWS SSO credentials by interactive profile selection
```

### `get` command

```sh-session
get AWS SSO credentials by ~/.aws/config profile

USAGE
  $ gsc get

OPTIONS
  -h, --help
  -p, --profile=profile  [default: default]
  -q, --quiet
  --json

EXAMPLE
  $ gsc get --profile my-profile
  Profile: my-profile
  Credentials expire at: 6:20:24 PM

  export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
  export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
  export AWS_SESSION_TOKEN=<AWS_SESSION_TOKEN>
```

### `select` command

```sh-session
get AWS SSO credentials by interactive AWS SSO selection

USAGE
  $ gsc select

OPTIONS
  -c, --credentials        writes credentials to ~/.aws/credentials (will use default as the profile name if --profile-name flag is not used)
  -h, --help
  -n, --profile-name=name  name of custom profile when using --credentials flag
  -q, --quiet
  --json

EXAMPLE
  $ gsc select
  ? Select an SSO url: (Use arrow keys)
  ❯ https://alpha.awsapps.com/start
    https://delta.awsapps.com/start
  ? Select an SSO account:
  ❯ Log archive | ctlogs@google.com | 111111111111
    test-alpha | testalpha@yahoo.com | 222222222222
  ? Select an SSO role: (Use arrow keys)
  ❯ AWSServiceCatalogEndUserAccess
    AWSAdministratorAccess
    ...
    Credentials expire at: 6:06:34 AM

    export AWS_ACCESS_KEY_ID=<Access Key ID>
    export AWS_SECRET_ACCESS_KEY=<Secret Access Key>
    export AWS_SESSION_TOKEN=<Session Token>
```

### `select-profile` command

```sh-session
get AWS SSO credentials by interactive profile selection

USAGE
  $ gsc select-profile

OPTIONS
  -P, --preserve     uses selected profile name when using --credentials flag
  -c, --credentials  writes credentials to ~/.aws/credentials (will use default as the profile name if --preserve flag is not used)
  -h, --help
  -q, --quiet
  --json

EXAMPLE
  $ gsc select-profile
  ? Select a profile: (Use arrow keys)
  ❯ default
    dev
    prod
    personal
```

### `login` command

```sh-session
initiates AWS SSO login

USAGE
  $ gsc login

OPTIONS
  -h, --help
  -p, --profile=profile  [default: default]

EXAMPLE
  $ gsc login --profile your-profile
  Logging in... ⣽
```

### `logout` command

```sh-session
initiates AWS SSO logout

USAGE
  $ gsc logout

OPTIONS
  -h, --help
  -p, --profile=profile  [default: default]

EXAMPLE
  $ gsc logout --profile your-profile
  Logging out... ⣽
```

### `clear` command

```sh-session
clears credentials in ~/.aws/credentials

USAGE
  $ gsc clear

OPTIONS
  -h, --help
  -p, --profile=profile  clears given profile credentials in ~/.aws/credentials

EXAMPLE
  $ gsc clear
```

<!-- usagestop -->
