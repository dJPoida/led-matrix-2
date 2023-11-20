import React, { useCallback } from 'react';
import { TabDefinition } from '../../../types/TabDefinition.type';

export type TabListProps = {
  tabs: Array<TabDefinition>;
  onTabClick?: (tab: TabDefinition['id']) => void;
};

export const TabList: React.FC<TabListProps> = ({ tabs, onTabClick }) => {
  const handleTabClick = useCallback(
    (tabId: TabDefinition['id']) => {
      if (onTabClick) {
        onTabClick(tabId);
      }
    },
    [onTabClick]
  );

  return (
    <ul className="tab-list">
      {tabs.map((tab) => (
        <li key={tab.id} onClick={() => handleTabClick(tab.id)}>
          {tab.label}
        </li>
      ))}
    </ul>
  );
};
