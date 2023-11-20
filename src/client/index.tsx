/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ControlPage } from './pages/control.page';

import './style.scss';

const container = document.getElementById('app_root');
const root = createRoot(container!);
root.render(<ControlPage />);
