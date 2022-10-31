# Directory Serve

Directory serve is a CLI library for sending and receiving a file from your android and IOS devices.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install -g directory-serve
```

## Help

```bash
npx directory-serve --help
```

## Usage

After installing globally

```bash
 npx directory-serve /path-of-directory
```

or

Directly use the command

```bash
 npx directory-serve /path-of-directory
```

or

```bash
npx directory-serve /path-to-file
```

## Arguments

| options  |  default  |           description           |                                         Example                                         |
| :------: | :-------: | :-----------------------------: | :-------------------------------------------------------------------------------------: |
|    u     |   true    |   Restrict upload file option   |                    `npx directory-serve /path-of-directory -u=false`                    |
|    p     |   8989    |         Change the port         |                    `npx directory-serve /path-of-directory -p=3000`                     |
|   help   |           |              Help               |                              `npx directory-serve --help `                              |
| username | undefined |      Client auth username       |            `npx directory-serve /path-of-directory --username=my_username `             |
| password | undefined | Client auth password (optional) | `npx directory-serve /path-of-directory --username=my_username --password=my_password ` |

## Examples

```bash
npx directory-serve .
```

```bash
npx directory-serve ~/Desktop
```

```bash
npx directory-serve ~/Desktop/my_image.png
```

```bash
npx directory-serve ~/Desktop -p=3000 --username=test --password=password
```

## For Developing

### prerequisite

1. Node (>=14.0)

<br/>
clone the repo and follow the commands

```bash
git clone https://github.com/cube-root/directory-serve.git
```

```bash
npm i
```

```bash
npm run dev /path-of-directory
```

## Screenshot

### CLI

![screenshot](/doc/terminal-screenshot.png?raw=true "Directory serve")

### Client

![screenshot](/doc/directory-list.png?raw=true)

### Client Auth

![screenshot](/doc/basic-auth.png?raw=true)
