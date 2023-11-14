import React, { useContext } from 'react';
import classNames from 'classnames';

import { SocketContext } from '../providers/socket.provider';
import { Icon } from './icon';
import { ICON } from '../constants/icon.const';

export const ControlInterface: React.FC = () => {
  const { socketConnected } = useContext(SocketContext);
  // const localSettings = useContext(LocalSettingsContext);

  return (
    <div className={classNames('control-interface', {})}>
      {socketConnected ? 'Socket Connected' : 'Socket Disconnected'}
      <Icon icon={ICON.ADD_CIRCLE} color="white" type="solid" animation="flashing" size="lg" />
    </div>
  );
};
