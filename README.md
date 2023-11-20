# led-matrix-2
A generic control system for led matrices running on a Raspberry Pi written in Typescript

# Running the project
The `/dist` folder in this repo contains the compiled production ready code. Running this library on a target machine requires only few packages to be downloaded.

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

### Prerequisites
Ensure you have this software installed first
- [NodeJS](https://nodejs.org/en/about/previous-releases) (This code is optimised for v18.8.2). Optionally, you can install node using [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) or ([NVM on Windows](https://github.com/coreybutler/nvm-windows)) and [switch to v18.8.2](#switching-node-versions-using-nvm).
- Corepack should be enabled to use Yarn 4

  ```
  corepack enable
  ```
- [Yarn 4](https://yarnpkg.com/getting-started/install)

  ```
  yarn set version stable
  ```

### Setting up the local dev environment
- Clone the Led Matrix repo

  ```sh
  git clone https://github.com/dJPoida/led-matrix-2.git
  ```

- Checkout the dev branch

  ```sh
  git checkout dev
  ```

  (or create a new branch)

  ```
  git checkout -b my-branch
  ```

- Update packages  
  
  ```sh
  yarn install
  ```

- Copy and update the example [environment configuration](#environment-variables)  

  ```sh
  cp .env.example .env
  ```

- Run the development server

  ```sh
  yarn dev
  ```

**Note:** If you want to work exclusively on the Server code without continuously re-compiling the client, you can set `USE_WEBPACK=false` in your `.env` to disable the webpack development server and hot reloading.

### Switching Node versions using NVM
When switching node versions using NVM you have to re-enable the global packages for that node version.
```
nvm install 18.18.2
nvm use 18.18.2
corepack enable
```

### Typescript version
When prompted in VSCode, make sure you are running the Workspace Typescript version.
If you don't get prompted, it's recommended you check to ensure VSCode is using the workspace typescript version.

- Open up VS Code
- Open up any Typescript file (i.e. `server.ts`)
- Open up the Command Palette `CTRL + SHIFT + P`
- Select `TypeScript: Select TypeScript Version...`
- Select `Use Workspace Version`

## Environment Variables
These environment variables need to be configured in your [`.env`](/.env) file. If you have not yet initialised this file you can copy the [`.env.example`](/.env.example)

### Server Environment Variables
These environment variables mainly control the behaviour of the server.

|Variable|Example Values|Description|
|---|---|---|
|`HTTP_PORT`|`3000`, `80`, `8080`|The port to serve the HTTP Interface from
|`LOG_PATH`|`"./logs"`|The path to store server log files (absolute or relative acceptable)
|`LOG_LEVEL`|`"info"`, `"error"`, `"warn"`, `"debug"`, `"verbose"`|How granular the log messages should be Possible values in increasing levels of verbosity (Does not impact production which is hardcoded at `warn` and above)
|`USE_WEBPACK`|`true` / `false`|Whether to re-build the client (only applicable in development mode. Set to false to speed up server code changes)
|CLIENT_KEY|`"changeMe"`, `"IwuvLEDz1969"`|The client credential socket connections use to connect to the server

### Matrix Environment Variables
These environment variables relate directly to the LED matrix

|Variable|Example Values|Description|
|---|---|---|
|`LED_PIN`|`18`|The GPIO Pin that connects to the LED strip Data pin **NOTE: At this time this cannot be changed due to the library being used**
|`LED_FPS`|`60`, `30`|The target Frames per Second (FPS) to render to the matrix
|`LED_DEFAULT_BRIGHTNESS`|`128`|Default Brightness (`0`-`255`) (Be careful of max power output constraints!)
|`LED_MAX_BRIGHTNESS`|`192`|NeoPixels draw 60mA per pixel so do the math on the power supply!
|`LED_COUNT_X`|`32`, `16`|The number of LEDs in the matrix in the X direction
|`LED_COUNT_Y`|`32`, `16`|The number of LEDs in the matrix in the Y direction
|`LED_MAP`|`"DEFAULT"`, `0,1,2,3,7,6,5,4,8,9,10,11,15,14,13,12`|The wiring sequence of the LEDs. Leave this as `"DEFAULT"` unless the LEDs aren't wired in a standard sequential zig-zag order.

## Coding remotely on the Raspberry Pi
To see your changes affected in realtime, you can work on your local dev environment, remotely updating and building files directly on the Pi using the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension.

## Icons
This project leverages [Boxicons](https://boxicons.com/). When selecting icons and styles, refer to their [documentation](https://boxicons.com/usage).
