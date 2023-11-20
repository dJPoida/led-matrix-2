import classNames from 'classnames';
import React from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';

export type ResizeHandleProps = {
  className?: string;
  id?: string;
  hidden?: boolean;
};

export const ResizeHandle: React.FC<ResizeHandleProps> = (props) => {
  const { className, id, hidden = false } = props;

  return (
    <PanelResizeHandle
      className={classNames('resize-handle', className, {
        hidden,
      })}
      id={id}
    >
      <div className="resize-handle-inner"></div>
    </PanelResizeHandle>
  );
};
