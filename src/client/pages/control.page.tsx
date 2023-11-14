import React from 'react';
import { IosScrollFix } from '../components/ios-scroll-fix';
import { ControlInterface } from '../components/control-interface';
import { SocketProvider } from '../providers/socket.provider';
import { LocalSettingsProvider } from '../providers/local-settings.provider';
import { ErrorBoundary } from '../components/error-boundary';

export const ControlPage: React.FC = () => (
  <ErrorBoundary>
    <LocalSettingsProvider>
      <SocketProvider>
        <IosScrollFix>
          <ControlInterface />
        </IosScrollFix>
      </SocketProvider>
    </LocalSettingsProvider>
  </ErrorBoundary>
);
