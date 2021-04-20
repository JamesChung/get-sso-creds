get-sso-creds
=============

CLI tool to get AWS SSO temporary credentials.

[![Version](https://img.shields.io/npm/v/get-sso-creds.svg)](https://npmjs.org/package/get-sso-creds)
[![Downloads/week](https://img.shields.io/npm/dw/get-sso-creds.svg)](https://npmjs.org/package/get-sso-creds)
[![License](https://img.shields.io/npm/l/get-sso-creds.svg)](https://github.com/JamesChung/get-sso-creds/blob/main/LICENSE)

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
  get             get AWS SSO credentials by profile
  help            display help for gsc
  login           initiates AWS SSO login
  logout          initiates AWS SSO logout
  select          get AWS SSO credentials by interactive AWS SSO selection
  select-profile  get AWS SSO credentials by interactive profile selection
```

### `get` command

```sh-session
get AWS SSO credentials

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
  -h, --help
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
    Audit | ctaudit@hotmail.com | 333333333333
    test-delta | testdelta@outlook.com | 444444444444
    test-beta | testbeta@aol.com | 555555555555
    test-epsilon | testepsilon@icloud.com | 666666666666
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

<!-- usagestop -->
