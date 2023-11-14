export type SocketData = {
  authKey: string | null;
  authTimeout: ReturnType<typeof setTimeout> | null;
};
