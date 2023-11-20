import React, { useContext, useState } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import classNames from 'classnames';

import { SocketContext } from '../../../providers/Socket.provider';
import { ICON } from '../../../constants/icon.const';
import { Console } from '../Console/Console';
import { ResizeHandle } from '../../interface/ResizeHandle/ResizeHandle';
import { TabView } from '../../interface/TabView/TabView';
import { Timeline } from '../Timeline/Timeline';

const tabs = [
  {
    id: 'console',
    label: 'Console',
    component: <Console />,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    component: <Timeline />,
  },
];

export const ControlInterface: React.FC = () => {
  const { socketConnected } = useContext(SocketContext);
  // const localSettings = useContext(LocalSettingsContext);

  const [activeTabId, setActiveTabId] = useState('console');

  return (
    <div className="control-interface">
      <PanelGroup id="control_interface" direction="vertical" autoSaveId="controlInterface">
        {/* Status Bar */}
        <Panel id="statusBar" className="status-bar" order={1} maxSizePixels={40} minSizePixels={40}>
          Status Bar
          {/* {socketConnected ? 'Socket Connected' : 'Socket Disconnected'}
          <Icon icon={ICON.ADD_CIRCLE} color="white" type="solid" animation="flashing" size="lg" /> */}
        </Panel>
        <ResizeHandle id="status_bar_resize_handle" hidden />

        {/* Main Section */}
        <Panel id="main" order={2} className="main">
          <PanelGroup direction="horizontal">
            <Panel
              id="side_panel"
              className="side-panel"
              collapsible
              defaultSizePixels={250}
              minSizePixels={100}
              maxSizePixels={500}
            >
              Side Panel
            </Panel>
            <ResizeHandle id="side_panel_resize_handle" />
            <Panel id="render_preview" className="render-preview">
              Render Preview
            </Panel>
          </PanelGroup>
        </Panel>

        {/* Console */}
        <ResizeHandle id="tabview-resize-handle" />
        <Panel
          id="tab_view"
          className="tab-view"
          order={3}
          minSizePercentage={10}
          maxSizePercentage={50}
          defaultSizePercentage={30}
          collapsible
        >
          <TabView activeTabId={activeTabId} tabs={tabs} onActiveTabChange={(newTabId) => setActiveTabId(newTabId)} />
        </Panel>
      </PanelGroup>
    </div>
  );
};
