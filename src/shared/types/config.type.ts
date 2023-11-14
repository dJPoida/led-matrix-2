import { A_LOG_LEVEL } from '../constants/logLevel.const';

export type Config = {
  env: {
    isProduction: boolean;
    isDevelopment: boolean;
    distPath: string;
    sourcePath: string;
    logPath: string;
    logLevel: A_LOG_LEVEL;
    useWebPack: boolean;
  };

  transport: {
    HTTPPort: number;
    clientKey: string;
  };

  ledMatrix: {
    GPIOPin: number;
    defaultBrightness: number;
    maxBrightness: number;
    countX: number;
    countY: number;
    numLEDs: number;
    map: 'DEFAULT' | Array<number>;
    fps: number;
    frameDuration: number;
  };

  app: {
    title: string;
    author: string;
    version: string;
    versionDate: string;
    versionSuffix: string;
  };
};
