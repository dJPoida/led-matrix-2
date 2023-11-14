import { CLIENT_COMMAND } from '../../constants/client-command.const';

export type ClientCommandDto = {
  type: CLIENT_COMMAND['SET_BRIGHTNESS'];
  payload: { value: number };
};
