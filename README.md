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
 directory-serve /path-of-directory
```

or

Directly use the command

```bash
 npx directory-serve /path-of-directory
```

## Arguments

| options | default |         description         |                      Example                      |
| :-----: | :-----: | :-------------------------: | :-----------------------------------------------: |
|    u    |  true   | Restrict upload file option | `npx directory-serve /path-of-directory -u=false` |
|    p    |  8989   |       Change the port       | `npx directory-serve /path-of-directory -p=3000`  |
|  help   |         |            Help             |           `npx directory-serve --help `           |

## Examples

```bash
npx directory-serve .
```

```bash
npx directory-serve ~/Desktop
```

## For Developing

### prerequisite

1. Node (>=16.0)

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

![screenshot](/doc/terminal-screenshot.png?raw=true "Directory serve")

![screenshot](/doc/directory-list.png?raw=true)
