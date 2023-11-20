import React, { useCallback, useMemo } from 'react';
import { TabDefinition } from '../../../types/TabDefinition.type';
import { TabList } from './TabList';

export type TabViewProps = {
  activeTabId: string;
  tabs: Array<TabDefinition>;
  onActiveTabChange: (newTabId: TabDefinition['id']) => void;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  const { activeTabId, tabs, onActiveTabChange } = props;

  const activeTabComponent = useMemo(() => {
    const tab = tabs.find((t) => t.id === activeTabId);
    if (tab) {
      return <React.Fragment key={tab.id}>{tab.component}</React.Fragment>;
    }
    return undefined;
  }, [tabs, activeTabId]);

  const handleTabClick = useCallback(
    (tabId: TabDefinition['id']) => {
      if (onActiveTabChange) {
        onActiveTabChange(tabId);
      }
    },
    [onActiveTabChange]
  );

  return (
    <div className="tab-view" data-active-tab-id={activeTabId}>
      <TabList tabs={tabs} onTabClick={handleTabClick} />
      <div className="active-tab">{activeTabComponent}</div>
    </div>
  );
};
