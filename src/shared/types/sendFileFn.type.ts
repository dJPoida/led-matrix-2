import express from 'express';

export type SendFileFn = {
  (res: express.Response, filePath: string, contentType?: string): void;
};
