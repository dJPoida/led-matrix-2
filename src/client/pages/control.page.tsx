import React from 'react';
import { SocketProvider } from '../providers/Socket.provider';
import { LocalSettingsProvider } from '../providers/LocalSettings.provider';
import { ErrorBoundary } from '../components/application/ErrorBoundary/ErrorBoundary';
import { ControlInterface } from '../components/application/ControlInterface/ControlInterface';

export const ControlPage: React.FC = () => (
  <ErrorBoundary>
    <LocalSettingsProvider>
      <SocketProvider>
        <ControlInterface />
      </SocketProvider>
    </LocalSettingsProvider>
  </ErrorBoundary>
);
