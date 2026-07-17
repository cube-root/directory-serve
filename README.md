# Directory Serve

<a href="https://www.producthunt.com/posts/directory-serve?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-directory&#0045;serve" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=365677&theme=light" alt="Directory&#0032;Serve - Open&#0032;source&#0032;CLI&#0032;to&#0032;send&#0032;and&#0032;receive&#0032;file | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

Directory Serve is a CLI tool for securely browsing, sending, and receiving files
between computers, Android devices, and iOS devices on the same network.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
npm install --global directory-serve
```

## Quick start

```bash
directory-serve /path/to/directory
```

Without a global installation:

```bash
npx directory-serve /path/to/directory
```

Share one file:

```bash
npx directory-serve /path/to/file.pdf
```

The command prints a local URL and QR code. Open the URL on a device connected
to the same network.

## Command reference

```text
directory-serve <path> [options]
```

| Option | Default | Description |
| --- | --- | --- |
| `-p`, `--port <number>` | `8989` | HTTP port used by the server. |
| `-u`, `--uploadFile <boolean>` | `true` | Enable or disable uploads. Use `--uploadFile=false` for read-only sharing. |
| `--username <name>` | none | Require HTTP Basic Authentication with this username. |
| `--password <password>` | none | Password used with `--username`. |
| `--delete <boolean>` | `false` | Allow clients to remove files and folders. |
| `--max-upload-mb <number>` | `100` | Maximum size of each uploaded file in megabytes. |
| `--allowed-types <extensions>` | all | Comma-separated upload extension allowlist without dots. |
| `--upload-rate-limit <number>` | `30` | Maximum upload requests per client per minute. |
| `--debug <boolean>` | `false` | Print additional diagnostic information. |
| `--help` | — | Display command help. |
| `--version` | — | Display the installed version. |

Boolean options accept forms such as `--delete`, `--delete=true`, and
`--uploadFile=false`.

## Command examples

Share the current directory:

```bash
npx directory-serve .
```

Use a different port:

```bash
npx directory-serve ~/Desktop --port 3000
```

Create a read-only share with uploads and deletion disabled:

```bash
npx directory-serve ~/Desktop --uploadFile=false
```

Allow clients to upload and delete content:

```bash
npx directory-serve ~/Desktop --uploadFile=true --delete=true
```

Require a username and password:

```bash
npx directory-serve ~/Desktop --username test --password 'a-strong-password'
```

Limit each uploaded file to 25 MB:

```bash
npx directory-serve ~/Desktop --max-upload-mb 25
```

Only accept images and PDF documents:

```bash
npx directory-serve ~/Desktop --allowed-types jpg,jpeg,png,webp,pdf
```

Limit each client to ten upload requests per minute:

```bash
npx directory-serve ~/Desktop --upload-rate-limit 10
```

Combine authentication and all upload safeguards:

```bash
npx directory-serve ~/Desktop \
  --username team \
  --password 'a-strong-password' \
  --max-upload-mb 50 \
  --allowed-types jpg,jpeg,png,pdf,zip \
  --upload-rate-limit 10
```

Enable diagnostics while using another port:

```bash
npx directory-serve ~/Desktop --port 3000 --debug=true
```

Display help or the installed version:

```bash
npx directory-serve --help
npx directory-serve --version
```

## Browser features

- Search and filter the current directory.
- Sort items by name, modification date, size, or type.
- Switch between list and grid layouts.
- Upload multiple files with queue and progress feedback.
- View current-folder size, item count, and upload limit.
- Use light mode by default or manually switch to persistent dark mode.

Search operates on the currently open folder. Clear the search field to restore
all items; the selected file/folder filter remains active until it is changed to
**All items**.

## For Developing

### Prerequisites

1. Node (>=12.0)

Clone the repository and install its dependencies:

```bash
git clone https://github.com/cube-root/directory-serve.git
```

```bash
npm install
```

```bash
npm run dev -- /path/to/directory
```

## For Contributing

[Contribution Guide](/docs/CONTRIBUTING.MD)

## Screenshot

### CLI

![screenshot](/docs/screenshots/terminal-screenshot.png?raw=true "Directory serve")

### Client

![screenshot](/docs/screenshots/directory-list.png?raw=true)
![screenshot](/docs/screenshots/browser_with_remove.png?raw=true)

### Client Auth

![screenshot](/docs/screenshots/basic-auth.png?raw=true)
