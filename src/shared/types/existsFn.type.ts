export type ExistsFn = {
  (filePath: string): Promise<boolean>;
};
