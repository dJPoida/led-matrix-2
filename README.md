# led-matrix-2
A generic control system for led matrices running on a Raspberry Pi written in Typescript

# Running the project
The `/dist` compiled output is contained within the repo. Running this library on a target machine requires only a lightweight download of only a few packages.

## Setting up the Raspberry Pi
This project is designed for a Raspberry Pi 4.

### 1. Download and run Raspberry Pi Imager
First grab an SD card and spin up a fresh install of Raspberry Pi OS. Grab the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) software and run it using the following config:
- Raspberry Pi Device: `RASPBERRY PI 4`
- Operating System: `RASPBERRY PI OS (64-BIT)`
- Storage: `<INSERT YOUR SD CARD DEVICE HERE>`

When asked if you would like to apply OS customisation settings, click `EDIT SETTINGS` and apply the following:
- Set hostname: `ledmatrix`
- Set username and password: `pi` / `ledmatrix`
- Configure wireless LAN: `<INSERT YOUR WIFI DETAILS HERE>`
- Set local settings: `<INSERT YOUR LOCALE SETTINGS HERE>`

Save the custom settings and write the image to the SD Card

### 2. Hook up the Pi and configure it
Using a physical screen, keyboard and mouse - follow the guides to
- [Setup remote SSH access](https://www.raspberrypi.com/documentation/computers/remote-access.html#ssh)

### 3. Install the LED Matrix 2 software
TODO Documentation for installing the software on the Raspberry Pi

# Contributing to the project

## Development Environment
Sometimes you just wanna code without having the pain of building in the low spec environment of the Raspberry Pi. This project can be run in emulation mode on a fully featured dev environment without the LED hardware.

- Clone the repo `git clone https://github.com/dJPoida/led-matrix-2.git`
- Checkout the dev branch `git checkout dev` (or create a new branch `git checkout -b my-branch`)
- Update packages `yarn`
- Run the development server `yarn dev`

If you want to work exclusively on the Server code without continuously re-compiling the client, you can set `USE_WEBPACK=false` in your `.env` to disable the webpack development server and hot reloading.

## Switching Node versions using NVM
When switching node versions using NVM you have to re-enable the global packages for that node version.
```
nvm install 18.18.2
nvm use 18.18.2
corepack enable
```


## Typescript version
This project uses Yarn PNP based linking. Therefore some editor SDKs are required for it to work in VSCode.
Refer to [Yarn's Documentation on SDKs](https://yarnpkg.com/getting-started/editor-sdks) for more info.
```
yarn dlx @yarnpkg/sdks vscode
```
**IMPORTANT:** When prompted in VSCode, make sure you are running the Workspace Typescript version.

## Coding remotely on the Raspberry Pi
To see your changes affected in realtime, you can work on your local dev environment, remotely updating and building files directly on the Pi using the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension.

## Icons
This project leverages [Boxicons](https://boxicons.com/). When selecting icons and styles, refer to their [documentation](https://boxicons.com/usage).
