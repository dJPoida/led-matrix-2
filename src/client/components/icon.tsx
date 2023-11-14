import React from 'react';
import classNames from 'classnames';

import { AN_ICON } from '../constants/icon.const';

export type IconProps = {
  icon: AN_ICON;
  type?: 'regular' | 'solid' | 'logo';
  color?: string; // TODO: Strictly type icon color to a style color. Maybe look at https://www.npmjs.com/package/color
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rotate?: '90' | '180' | '270';
  flip?: 'horizontal' | 'vertical';
  border?: 'square' | 'circle';
  animation?: 'spin' | 'tada' | 'flashing' | 'burst' | 'fade-left' | 'fade-right' | 'fade-up' | 'fade-down';
  animateOnHover?: boolean;
  pull?: 'left|right';
};

/**
 * React component for rendering out an icon.
 * This project primarily utilises BoxIcons
 *
 * @see https://boxicons.com/usage#styling
 */
export const Icon: React.FC<IconProps> = (props) => {
  const { icon, type, color, size, rotate, flip, border, animation, animateOnHover, pull } = props;

  return (
    <i
      style={{ color }}
      className={classNames('bx', {
        [`bx-${icon}`]: !type || type === 'regular',
        [`bxs-${icon}`]: type === 'solid',
        [`bxl-${icon}`]: type === 'logo',
        [`bx-${size}`]: !!size,
        [`bx-rotate-${rotate}`]: !!rotate,
        [`bx-flip-${flip}`]: !!flip,
        [`bx-border`]: border === 'square',
        [`bx-border-circle`]: border === 'circle',
        [`bx-${animation}`]: !!animation && !animateOnHover,
        [`bx-${animation}-hover`]: !!animation && !!animateOnHover,
      })}
    />
  );
};
