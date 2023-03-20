import { ReactNode } from 'react';

export interface IColorInterval {
  isActive: (percentage: number) => boolean;
  color: string;
}

export interface IPercentageCircle {
  size: number;
  thickness: number;
  percentage: number;
  contentToDisplay: (
    percentage: number,
    activeInterval: IColorInterval | undefined | null
  ) => ReactNode | string;
  contentToDisplayOnHover?: (
    percentage: number,
    activeInterval: IColorInterval | undefined | null
  ) => ReactNode | string;
  primaryColor?: string;
  secondaryColor?: string;
  colorIntervals?: IColorInterval[];
  strokeLinecap: any;
  primaryShadowFilter?: (activeColor: string) => string;
  secondaryShadowFilter?: (activeColor: string) => string;
  useAutomaticIcrement: boolean;
  automaticIcrementDelayMs?: number;
  onMouseEnter?: () => any;
  onMouseLeave?: () => any;
  onClick?: () => any;
  cursor?: string;
}

export interface IPercentageCircleStyle {
  strokeDasharray?: string;
  strokeDashoffset?: string;
}
