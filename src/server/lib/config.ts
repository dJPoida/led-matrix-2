import dotenv from 'dotenv';
import { resolve } from 'path';

import { fpsToFrameDuration } from '../../shared/helpers/fpsToFrameDuration.helper';

import { existsSync } from 'fs';
import { Config } from '../../shared/types/config.type';
import { A_LOG_LEVEL } from '../../shared/constants/logLevel.const';

// Read some application data from the `package.json`
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../../package.json');

// Check if the .env exists
if (!existsSync(resolve(__dirname, '../../../.env'))) {
  throw new EvalError(
    'You have not created a local `.env` file. Please clone `.env.example` and customise its contents.'
  );
}

// Load the `.env` file using the dotenv library
dotenv.config({
  path: resolve(__dirname, '../../../.env'),
});

/**
 * Convert an environment variable to a strictly typed boolean
 */
const envBool = (name: string): boolean => {
  const input = process.env[name];
  if (input === 'true') return true;
  if (input === 'false') return false;
  throw new TypeError(`Unable to parse .env entry "${name}" as boolean`);
};

/**
 * Convert an environment variable to a strictly typed number
 */
const envNum = (name: string): number => {
  const input = process.env[name];
  const num = Number(input);
  if (Number.isNaN(num) || !Number.isFinite(num))
    throw new TypeError(`Unable to parse .env entry "${name}" as number (got ${num})`);
  return num;
};

/**
 * Convert an environment variable to a strictly typed string
 */
const envString = (name: string): string => {
  const input = process.env[name];
  if (input === undefined) throw new TypeError(`Unable to parse .env entry "${name}" as string`);
  return input;
};

/**
 * Convert an environment variable to a strictly typed array of numbers (integers)
 */
const envIntArray = (name: string, expectedItems?: number): Array<number> => {
  const input: string = process.env[name] ?? '';
  const numberArray: Array<number> = [];
  try {
    numberArray.push(...input.split(',').map((stringVal: string) => parseInt(stringVal, 10)));
  } catch (err) {
    throw new TypeError(
      `Unable to parse .env entry "${name}" as an array of numbers. Ensure the value is numbers separated by commas eg: "0,1,2,3,4,5"`
    );
  }

  // Make sure the array contains the correct number of items
  if (expectedItems !== undefined && numberArray.length !== expectedItems) {
    throw new TypeError(
      `Unable to parse .env entry "${name}". There must be exactly ${expectedItems} items in the list of numbers.`
    );
  }

  return numberArray;
};

/**
 * Initialise or get the config singleton.
 */
export const config: Config = {
  env: {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    distPath: resolve(__dirname, '../../../dist'),
    sourcePath: resolve(__dirname, '../../../src'),
    logPath: resolve(__dirname, '../../../', envString('LOG_PATH')),
    logLevel: envString('LOG_LEVEL') as A_LOG_LEVEL,
    useWebPack: envBool('USE_WEBPACK'),
  },

  transport: {
    HTTPPort: envNum('HTTP_PORT'),
    clientKey: envString('CLIENT_KEY'),
  },

  ledMatrix: {
    GPIOPin: envNum('LED_PIN'),
    defaultBrightness: envNum('LED_DEFAULT_BRIGHTNESS'),
    maxBrightness: envNum('LED_MAX_BRIGHTNESS'),
    countX: envNum('LED_COUNT_X'),
    countY: envNum('LED_COUNT_Y'),
    numLEDs: envNum('LED_COUNT_X') * envNum('LED_COUNT_Y'),
    map:
      envString('LED_MAP') === 'DEFAULT'
        ? 'DEFAULT'
        : envIntArray('LED_MAP', envNum('LED_COUNT_X') * envNum('LED_COUNT_Y')),
    fps: envNum('LED_FPS'),
    frameDuration: fpsToFrameDuration(envNum('LED_FPS')),
  },

  app: {
    title: packageJson.appTitle,
    author: packageJson.author,
    version: packageJson.version,
    versionDate: packageJson.versionDate,
    versionSuffix: packageJson.version.replace(/\./g, '-'),
  },
};
