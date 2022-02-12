get-sso-creds
=============

CLI tool to get AWS SSO temporary credentials.

[![Version](https://img.shields.io/npm/v/get-sso-creds)](https://npmjs.org/package/get-sso-creds)
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
CLI tool to retrieve or set AWS SSO credentials

USAGE
  $ gsc [COMMAND]

TOPICS
  plugins  List installed plugins.

COMMANDS
  clear    Clears selected credentials in ~/.aws/credentials
  get      Get AWS SSO credentials via existing profile in ~/.aws/config
  help     Display help for gsc.
  login    Initiates AWS SSO login
  logout   Initiates AWS SSO logout
  ls       Lists profile names in ~/.aws/config or ~/.aws/credentials
  plugins  List installed plugins.
  select   Get AWS SSO credentials via AWS SSO
```

### `get` command

```sh-session
Get AWS SSO credentials via existing profile in ~/.aws/config

USAGE
  $ gsc get [--help] [-P -c] [--json]

FLAGS
  -P, --preserve     Sets selected profile name as the profile name in ~/.aws/credentials when using --credentials flag
  -c, --credentials  Writes credentials to ~/.aws/credentials (will use default as the profile name if --preserve flag is not used)
  --help             Show CLI help.
  --json             Outputs credentials in json format

DESCRIPTION
  Get AWS SSO credentials via existing profile in ~/.aws/config

EXAMPLES
  $ gsc get
  ? Select a profile: (Use arrow keys)
  ❯ default
    dev
    prod
    personal
  Profile: my-profile
  Credentials expire at: 6:20:24 PM
  export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
  export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
  export AWS_SESSION_TOKEN=<AWS_SESSION_TOKEN>
```

### `select` command

```sh-session
Get AWS SSO credentials via AWS SSO

USAGE
  $ gsc select [--help] [--json] [-n <value> -c]

FLAGS
  -c, --credentials  writes credentials to ~/.aws/credentials (will use default as the profile name if --set-profile-as flag is not used)
  -n, --set-as=name  Desired name of profile when setting credentials via --credentials flag
  --help             Show CLI help.
  --json             Outputs credentials in json format

DESCRIPTION
  Get AWS SSO credentials via AWS SSO

EXAMPLES
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
```

### `ls` command

```sh-session
Lists profile names in ~/.aws/config or ~/.aws/credentials

USAGE
  $ gsc ls [--help]

FLAGS
  --help  Show CLI help.

DESCRIPTION
  Lists profile names in ~/.aws/config or ~/.aws/credentials

EXAMPLES
  $ gsc ls
  ? Select a file: (Use arrow keys)
  ❯ config
    credentials
```

### `login` command

```sh-session
Initiates AWS SSO login

USAGE
  $ gsc login [--help] [-p <value>]

FLAGS
  -p, --profile=<value>  [default: default] Profile name to use for login
  --help                 Show CLI help.

DESCRIPTION
  Initiates AWS SSO login

EXAMPLES
  $ gsc login --profile your-profile
  Logging in... ⣽
```

### `logout` command

```sh-session
Initiates AWS SSO logout

USAGE
  $ gsc logout [--help] [-p <value>]

FLAGS
  -p, --profile=<value>  [default: default] Profile name to use for logout
  --help                 Show CLI help.

DESCRIPTION
  Initiates AWS SSO logout

EXAMPLES
  $ gsc logout --profile your-profile
  Logging out... ⣽
```

### `clear` command

```sh-session
Clears selected credentials in ~/.aws/credentials

USAGE
  $ gsc clear [--help]

FLAGS
  --help  Show CLI help.

DESCRIPTION
  Clears selected credentials in ~/.aws/credentials

EXAMPLES
  $ gsc clear
  ? Select a profile: (Use arrow keys)
  ❯ default
    personal
```

<!-- usagestop -->
